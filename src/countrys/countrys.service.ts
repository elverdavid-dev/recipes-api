import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  deleteCacheByKey,
  generateCacheKey,
  getDataCache,
} from '@utils/cache.utils';
import { paginateResults } from '@utils/paginate.utlis';
import { Cache } from 'cache-manager';
import * as fse from 'fs-extra';
import { Model } from 'mongoose';
import { deleteImage, uploadImage } from 'src/utils/cloudinary.config';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
@Injectable()
export class CountrysService {
  constructor(
    @InjectModel(Country.name) private CountryEntity: Model<Country>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  private cacheKey = '';
  /**
   * Servicio para obtener todas las regiones
   * @returns Lista de las regiones
   */

  async findAll(page: number, limit: number) {
    //Generar cacheKey
    this.cacheKey = generateCacheKey(page, limit);
    //Obtener las regiones de la cache si existe
    const cacheData = await getDataCache(this.cacheManager, this.cacheKey);

    //Obtener el total de regiones agregadas a la DB
    const totalCountrys = await this.CountryEntity.countDocuments();

    //paginacion
    const { currentPage, totalItems, totalPages, skip } = paginateResults(
      totalCountrys,
      page,
      limit,
    );

    //si los datos existen en cache entonces los retorna
    if (cacheData) {
      return cacheData;
    }

    const listCountrys = await this.CountryEntity.find()
      .skip(skip)
      .limit(limit)
      .select('-public_id')
      .sort({ _id: -1 });
    const pageData = {
      page: currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems,
      data: listCountrys,
    };
    return pageData;
  }

  /**
   * Servicio para obtener región por id
   * @param id - Id de la región que se desea buscar
   * @returns región especifica buscada
   * @throws {HttpException} si la región no existe
   */

  async findOne(id: string) {
    const country = await this.CountryEntity.findById(id).select('-public_id');
    if (!country) {
      throw new HttpException('La region no existe', HttpStatus.NOT_FOUND);
    }
    return country;
  }

  /**
   * @description servicio para crear una region relacionada a una receta
   * @param createCountryDto - datos de la nueva region
   * @param image - imagen relacionado a la region
   * @returns Un mensaje de éxito y el nombre de la region creada.
   * @throws {HttpException} Si ocurre un error durante el proceso de creación.
   */
  async create(createCountryDto: CreateCountryDto, image: Express.Multer.File) {
    try {
      //Eliminar la cache
      if (this.cacheKey) {
        await deleteCacheByKey(this.cacheManager, this.cacheKey);
        this.cacheKey = '';
      }

      const cloudinaryResponse = await uploadImage(image.path, 'countrys');
      await fse.unlink(image.path);

      const newCountry = await this.CountryEntity.create({
        ...createCountryDto,
        image: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      });
      newCountry.save();
      return {
        message: 'Region creada correctamente',
        name: createCountryDto.name,
      };
    } catch (error) {
      await fse.unlink(image.path);
      throw new HttpException(
        'Error al crear una region!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Servicio para actualizar una region ya existente
   * @param id - Id de la region que se desea actualizar
   * @param updateCountryDto - Datos actualizados de la categora.
   * @param image - si la imagen de la region se desea actualiza
   * @returns Un mensaje de éxito y el nombre de la region actualizada.
   * @throws {HttpException} Si la region no existe.
   *  */

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
    image: Express.Multer.File,
  ) {
    const countryFound = await this.CountryEntity.findById(id);
    if (!countryFound) {
      await fse.unlink(image.path);
      throw new HttpException('La region no existe!', HttpStatus.NOT_FOUND);
    }

    //Eliminar la cache
    if (this.cacheKey) {
      await deleteCacheByKey(this.cacheManager, this.cacheKey);
      this.cacheKey = '';
    }

    //Eliminar la cache
    if (this.cacheKey) {
      await deleteCacheByKey(this.cacheManager, this.cacheKey);
      this.cacheKey = '';
    }

    if (image) {
      await deleteImage(countryFound.public_id);
      const newImage = await uploadImage(image.path, 'countrys');
      await fse.unlink(image.path);
      updateCountryDto.image = newImage.secure_url;
      updateCountryDto.public_id = newImage.public_id;
    }

    await this.CountryEntity.findByIdAndUpdate(id, updateCountryDto);
    return {
      message: 'Region actualizada correctamente',
      name: countryFound.name,
    };
  }

  /**
   * Servicio para eliminar una region existente.
   * @param id - ID de la region que se desea eliminar.
   * @returns Un mensaje de éxito y el nombre de la region eliminada.
   * @throws {HttpException} Si la region no existe.
   */
  async remove(id: string) {
    const countryFound = await this.CountryEntity.findById(id);
    if (!countryFound) {
      throw new HttpException('La region no existe!', HttpStatus.NOT_FOUND);
    }
    await this.CountryEntity.findByIdAndDelete(id);
    return {
      message: 'Region eliminada correctamente',
      name: countryFound.name,
    };
  }
}
