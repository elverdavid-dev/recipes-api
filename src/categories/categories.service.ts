import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import * as fse from 'fs-extra';
import { Model } from 'mongoose';
import { deleteImage, uploadImage } from 'src/utils/cloudinary.config';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private CategoryEntity: Model<Category>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  private readonly cacheKey = 'categories_cache_key';

  /**
   * Servicio para obtener todas las categorias
   * @returns Lista de las categorias
   */
  async findAll() {
    const cacheData = await this.cacheManager.get(this.cacheKey);
    if (!cacheData) {
      const categories = await this.CategoryEntity.find()
        .select('-public_id')
        .sort({ createdAt: -1 });
      await this.cacheManager.set(this.cacheKey, categories);
      console.log('cache from database');
      return categories;
    }
    console.log('data from cache');
    return cacheData;
  }

  /**
   * Servicio para obtener categoria por id
   * @param id - Id de la categoria que se desea buscar
   * @returns categoria especifica buscada
   * @throws {HttpException} si la categoria no existe
   */
  async findOne(id: string) {
    const category = await this.CategoryEntity.findById(id).select(
      '-public_id',
    );
    if (!category) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  /**
   * Servicio para crea una nueva categoria con los detalles proporcionados y la imagen asociada.
   * @param createRecipeDto - Datos de la categoria a crear.
   * @param image - Imagen asociada a la categoria.
   * @returns Un mensaje de éxito y el nombre de la categoria creada.
   * @throws {HttpException} Si ocurre un error durante el proceso de creación.
   */
  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    try {
      const cloudinaryResponse = await uploadImage(image.path, 'categories');
      await fse.unlink(image.path);
      const newCategory = await this.CategoryEntity.create({
        ...createCategoryDto,
        image: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      });
      newCategory.save();
      await this.cacheManager.del(this.cacheKey);

      return {
        message: 'Categoria creada correctamente',
        name: createCategoryDto.name,
      };
    } catch (error) {
      throw new HttpException(
        'Error al crear una categoria!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Servicio para actualizar una categoria ya existente
   * @param id - Id de la categoria que se desea actualizar
   * @param updateRecipeDto - Datos actualizados de la categora.
   * @param image - si la imagen de la categoria se desea actualiza
   * @returns Un mensaje de éxito y el nombre de la categoria actualizada.
   * @throws {HttpException} Si la categoria no existe.
   *  */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    try {
      const categoryFound = await this.CategoryEntity.findById(id);

      if (!categoryFound) {
        throw new HttpException(
          'La categoria no existe!',
          HttpStatus.NOT_FOUND,
        );
      }

      if (image) {
        await deleteImage(categoryFound.public_id);

        const newImage = await uploadImage(image.path, 'categories');
        await fse.unlink(image.path);
        updateCategoryDto.image = newImage.secure_url;
        updateCategoryDto.public_id = newImage.public_id;
      }

      await this.CategoryEntity.findByIdAndUpdate(id, updateCategoryDto);
      await this.cacheManager.del(this.cacheKey);
      return {
        message: 'Categoria actualizada correctamente',
        name: updateCategoryDto.name,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Servicio para eliminar una categoria existente.
   * @param id - ID de la categoria que se desea eliminar.
   * @returns Un mensaje de éxito y el nombre de la categoria eliminada.
   * @throws {HttpException} Si la categoria no existe.
   */
  async remove(id: string) {
    const categoryFound = await this.CategoryEntity.findById(id);
    if (!categoryFound) {
      throw new HttpException('La categoria no existe!', HttpStatus.NOT_FOUND);
    }
    await deleteImage(categoryFound.public_id);
    await this.CategoryEntity.findByIdAndDelete(id);
    await this.cacheManager.del(this.cacheKey);
    return {
      message: 'Categoria eliminada correctamente',
      name: categoryFound.name,
    };
  }
}
