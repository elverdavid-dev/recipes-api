import { deleteImage, uploadImage } from '@/config/cloudinary.config'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  deleteCacheByKey,
  generateCacheKey,
  getDataCache
} from '@utils/cache.utils'
import { paginateResults } from '@utils/paginate.utlis'
import { Cache } from 'cache-manager'
import * as fse from 'fs-extra'
import { Model } from 'mongoose'
import { CreateRecipeDto } from './dto/create-recipe.dto'
import { UpdateRecipeDto } from './dto/update-recipe.dto'
import { Recipe } from './entities/recipe.entity'

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private RecipeEntity: Model<Recipe>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  private cacheKey = ''

  /**
   * @description Servicio para obtener todas las recetas
   * @param page - pagina actual
   * @param limit - catidad de recetas por pagina
   * @returns Lista de las recetas
   * @throws {HttpException} Si la pagina no existe o es menor o igual a 0
   */
  async findAll(page = 1, limit = 20) {
    //Generar cacheKey
    this.cacheKey = generateCacheKey(page, limit)

    //Obtener las recetas de la cache si existe
    const cacheData = await getDataCache(this.cacheManager, this.cacheKey)

    //Obtener el total de recetas agregadas a la DB
    const totalRecipes = await this.RecipeEntity.countDocuments()

    const { currentPage, totalItems, totalPages, skip } = paginateResults(
      totalRecipes,
      page,
      limit
    )

    //si los datos existen en cache entonces los retorna
    if (cacheData) {
      return cacheData
    }

    //Si no hay datos en cache entoce se agregan
    const listRecipes = await this.RecipeEntity.find()
      .skip(skip)
      .limit(limit)
      .populate('category', '-public_id')
      .populate('country', '-public_id')
      .select('-public_id')
      .sort({ createdAt: -1 })

    const recipePageData = {
      page: currentPage,
      totalPages,
      itemsPerPage: listRecipes.length,
      totalItems,
      data: listRecipes
    }
    await this.cacheManager.set(this.cacheKey, recipePageData)

    return recipePageData
  }

  /**
   * @description Servicio para obtener receta por id
   * @param id - Id de la receta que se desea buscar
   * @returns Receta especifica buscada
   * @throws {HttpException} si la receta no existe
   */

  async findOne(id: string) {
    const recipe = await this.RecipeEntity.findById(id)
      .populate('category', '-public_id')
      .populate('country', '-public_id')
      .select('-public_id')

    //Si la receta no existe entonces error 404
    if (!recipe) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND)
    }

    return recipe
  }

  /**
   * @description obtener las ultimas recetas agregadas
   * @returns Lista de las ultimas  recetas
   */
  async getLatestRecipes(limit: number) {
    return await this.RecipeEntity.find()
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', '-public_id')
      .populate('country', '-public_id')
      .select('-public_id')
  }

  /**
   * @description Servicio para buscar receta por nombre
   * @param name - Nombre de la receta que desea buscar
   * @returns Lista de recetas que tengan el nombre buscado
   * @throws Mensaje que indica que no hay recetas relacionadas con el nombre buscado
   */
  async searchByName(name: string, page: number, limit: number) {
    const query = { name: { $regex: name, $options: 'i' } }

    const totalRecipes = await this.RecipeEntity.countDocuments({
      name: { $regex: name, $options: 'i' }
    })
    const { currentPage, totalItems, totalPages, skip } = paginateResults(
      totalRecipes,
      page,
      limit
    )
    const recipes = await this.RecipeEntity.find(query)
      .skip(skip)
      .limit(limit)
      .populate('category', '-public_id')
      .populate('country', '-public_id')
      .select('-public_id')
      .sort({ createdAt: -1 })
    if (recipes.length === 0) {
      return {
        message: `No se encontraron recetas que coincidan con el nombre ${name}`
      }
    }
    const recipePageData = {
      page: currentPage,
      totalPages,
      itemsPerPage: recipes.length,
      totalItems,
      data: recipes
    }

    return recipePageData
  }

  /**
   * @description Servicio para obtener o filtrar todas las recetas de una categoría específica.
   * @param categoryId - ID de la categoría por la cual deseas filtrar las recetas.
   * @returns Lista de todas las recetas asociada a esa categoria
   * @throws Mensaje que indica que no hay recetas asociadas a esa categoria
   */

  async getAllRecipesOneCategory(
    categoryId: string,
    page: number,
    limit: number
  ) {
    const totalRecipes = await this.RecipeEntity.countDocuments({
      category: categoryId
    })
    const { currentPage, skip, totalItems, totalPages } = paginateResults(
      totalRecipes,
      page,
      limit
    )

    const recipes = await this.RecipeEntity.find({
      category: categoryId
    })
      .skip(skip)
      .limit(limit)
      .select('-public_id')
      .populate('category', '-public_id')
      .populate('country', '-public_id')
      .sort({ createdAt: -1 })

    if (recipes.length === 0) {
      return { message: 'No hay recetas en esta categoria!' }
    }

    const pageData = {
      page: currentPage,
      totalPages,
      itemsPerPage: recipes.length,
      totalItems,
      data: recipes
    }
    return pageData
  }

  /**
   *  Servicio para obtener o filtrar todas las recetas de una región específica.
   * @param countryId - ID de la región por la cual deseas filtrar las recetas.
   * @returns Lista de todas las recetas asociada a esa región
   * @throws Mensaje que indica que no hay recetas asociadas a esa región
   */

  async getAllRecipesOneCountry(countryId: string) {
    const recipes = await this.RecipeEntity.find({ country: countryId })
      .select('-public_id')
      .populate('category', '-public_id')
      .populate('country', '-public_id')

    if (recipes.length === 0) {
      return { message: 'No hay recetas relacionadas a este pais!' }
    }
    return recipes
  }
  /**
   * Servicio para crea una nueva receta con los detalles proporcionados y la imagen asociada.
   * @param createRecipeDto - Datos de la receta a crear.
   * @param image - Imagen asociada a la receta.
   * @returns Un mensaje de éxito y el nombre de la receta creada.
   * @throws {HttpException} Si ocurre un error durante el proceso de creación.
   */
  async create(createRecipeDto: CreateRecipeDto, image: Express.Multer.File) {
    try {
      //Eliminar la cache
      if (this.cacheKey) {
        await deleteCacheByKey(this.cacheManager, this.cacheKey)
        this.cacheKey = ''
      }
      //subir imagen a cloudinary y eliminarla de la carpeta upload
      const cloudinaryResponse = await uploadImage(image.path, 'recipes')
      await fse.unlink(image.path)
      //crear la receta y guardarla en la DB
      const newRecipe = new this.RecipeEntity({
        ...createRecipeDto,
        image: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id
      })
      newRecipe.save()

      return {
        message: `Receta ${createRecipeDto.name} creada correctamente`
      }
    } catch (error) {
      console.log(error)
      await fse.unlink(image.path)

      throw new HttpException(
        'Error al crear la receta',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Servicio para actualizar una receta ya existente
   * @param id - Id de la receta que se desea actualizar
   * @param updateRecipeDto - Datos actualizados de la receta.
   * @param image - si la imagen de la receta se desea actualiza
   * @returns Un mensaje de éxito y el nombre de la receta actualizada.
   * @throws {HttpException} Si la receta no existe.
   *  */
  async update(
    id: string,
    updateRecipeDto: UpdateRecipeDto,
    image: Express.Multer.File
  ) {
    //Si la recetas no existe error 404
    const recipeFound = await this.RecipeEntity.findById(id)
    if (!recipeFound) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND)
    }
    //Eliminar cache
    if (this.cacheKey) {
      await deleteCacheByKey(this.cacheManager, this.cacheKey)
      this.cacheKey = ''
    }
    //actualizar la imagen
    if (image) {
      await deleteImage(recipeFound.public_id)
      const newImage = await uploadImage(image.path, 'recipes')
      await fse.unlink(image.path)
      updateRecipeDto.image = newImage.secure_url
      updateRecipeDto.public_id = newImage.public_id
    }
    //receta actualizada
    await this.RecipeEntity.findByIdAndUpdate(id, updateRecipeDto)

    return {
      message: `Receta ${updateRecipeDto.name} actualizada correctamente`
    }
  }

  /**
   * Servicio para eliminar una receta existente.
   * @param id - ID de la receta que se desea eliminar.
   * @returns Un mensaje de éxito y el nombre de la receta eliminada.
   * @throws {HttpException} Si la receta no existe.
   */
  async remove(id: string) {
    //Si la receta no existe error 404
    const recipeFound = await this.RecipeEntity.findById(id)
    if (!recipeFound) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND)
    }
    //Eliminar cache
    if (this.cacheKey) {
      await deleteCacheByKey(this.cacheManager, this.cacheKey)

      this.cacheKey = ''
    }
    //Eliminar receta y eliminar imagen de cloudinary
    await deleteImage(recipeFound.public_id)
    await this.RecipeEntity.findByIdAndDelete(id)
    return {
      message: `Receta ${recipeFound.name} eliminada correctamente`
    }
  }
}
