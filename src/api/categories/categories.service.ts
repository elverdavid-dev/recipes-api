import { deleteImage, uploadImage } from '@/config/cloudinary.config'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { deleteCacheByKey, getDataCache } from '@utils/cache.utils'
import { Cache } from 'cache-manager'
import * as fse from 'fs-extra'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private CategoryEntity: Model<Category>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  private readonly cacheKey = 'categories_cache_key'

  /**
   * Servicio para obtener todas las categorias
   * @returns Lista de las categorias
   */
  async findAll() {
    //Obtener categorias de la cache si existe
    const cacheData = await getDataCache(this.cacheManager, this.cacheKey)

    //si los datos existen en cache entonces los retorna
    if (cacheData) {
      return cacheData
    }

    //Si no hay datos en la cache entonces se agregan
    const categories = await this.CategoryEntity.find()
      .select('-public_id')
      .sort({ createdAt: -1 })
    await this.cacheManager.set(this.cacheKey, categories)

    return categories
  }

  /**
   * Servicio para obtener categoria por id
   * @param id - Id de la categoria que se desea buscar
   * @returns categoria especifica buscada
   * @throws {HttpException} si la categoria no existe
   */
  async findOne(id: string) {
    const category = await this.CategoryEntity.findById(id).select('-public_id')
    //Error 404 si no existe la caregoria
    if (!category) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND)
    }
    return category
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
    image: Express.Multer.File
  ) {
    try {
      //Eliminar las categorias de la cache si existen
      await deleteCacheByKey(this.cacheManager, this.cacheKey)
      //subir imagen a cloudinary y eliminarla de la carpeta upload
      const cloudinaryResponse = await uploadImage(image.path, 'categories')
      await fse.unlink(image.path)
      //Crear la categoria y guardarla en la DB
      const newCategory = await this.CategoryEntity.create({
        ...createCategoryDto,
        image: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id
      })
      newCategory.save()
      await deleteCacheByKey(this.cacheManager, this.cacheKey)

      return {
        message: `Categoria ${createCategoryDto.name} creada correctamente`
      }
    } catch (error) {
      throw new HttpException(
        'Error al crear una categoria!',
        HttpStatus.BAD_REQUEST
      )
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
    image: Express.Multer.File
  ) {
    try {
      //Error 404 si la categoria no existe
      const categoryFound = await this.CategoryEntity.findById(id)

      if (!categoryFound) {
        throw new HttpException('La categoria no existe!', HttpStatus.NOT_FOUND)
      }
      //Eliminar cache
      await deleteCacheByKey(this.cacheManager, this.cacheKey)
      //Actualizar imagen
      if (image) {
        const newImage = await uploadImage(image.path, 'categories')
        await fse.unlink(image.path)
        updateCategoryDto.image = newImage.secure_url
        updateCategoryDto.public_id = newImage.public_id
      }
      //Actualizar categoria
      await this.CategoryEntity.findByIdAndUpdate(id, updateCategoryDto)

      return {
        message: `Categoria ${updateCategoryDto.name} actualizada correctamente`
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Servicio para eliminar una categoria existente.
   * @param id - ID de la categoria que se desea eliminar.
   * @returns Un mensaje de éxito y el nombre de la categoria eliminada.
   * @throws {HttpException} Si la categoria no existe.
   */
  async remove(id: string) {
    //Error 404 si la categoria no existe
    const categoryFound = await this.CategoryEntity.findById(id)
    if (!categoryFound) {
      throw new HttpException('La categoria no existe!', HttpStatus.NOT_FOUND)
    }
    //Eliminar cache si existe
    await deleteCacheByKey(this.cacheManager, this.cacheKey)
    //Eliminar imagen de cloudinary y eliminar categoria de la DB
    await deleteImage(categoryFound.public_id)
    await this.CategoryEntity.findByIdAndDelete(id)
    return {
      message: `Categoria ${categoryFound.name} eliminada correctamente`
    }
  }
}
