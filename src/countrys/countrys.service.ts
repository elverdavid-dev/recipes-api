import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './entities/country.entity';
import { Model } from 'mongoose';
import { uploadImage } from 'src/utils/cloudinary.config';
import * as fse from 'fs-extra';

@Injectable()
export class CountrysService {
  constructor(
    @InjectModel(Country.name) private CountryEntity: Model<Country>,
  ) {}

  /**
   * @description servicio para crear una region relacionada a una receta
   */
  async create(createCountryDto: CreateCountryDto, image: Express.Multer.File) {
    try {
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
      throw new HttpException(
        'Error al crear una region!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.CountryEntity.find();
  }

  async findOne(id: number) {
    return await this.CountryEntity.findById(id);
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    return this.CountryEntity.findByIdAndUpdate(id, updateCountryDto);
  }

  async remove(id: number) {
    return await this.CountryEntity.findByIdAndDelete(id);
  }
}
