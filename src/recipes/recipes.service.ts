import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import * as fse from 'fs-extra';
import { Model } from 'mongoose';
import { deleteImage, uploadImage } from 'src/utils/cloudinary.config';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private RecipeEntity: Model<Recipe>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  private cacheKey = '';
  /**
   * Servicio para obtener todas las recetas
   * @param page - pagina actual
   * @param limit - catidad de recetas por pagina
   * @returns Lista de las recetas
   * @throws {HttpException} Si la pagina no existe o es menor o igual a 0
   */
  async findAll(page: number, limit: number) {
    this.cacheKey = `recipes_key_${page}_${limit}`;
    const cacheData = await this.cacheManager.get(this.cacheKey);

    const totalRecipes = await this.RecipeEntity.countDocuments();
    const totalPages = Math.ceil(totalRecipes / limit);
    if (page < 1 || page > totalPages) {
      throw new HttpException('Página no encontrada', HttpStatus.NOT_FOUND);
    }

    if (!cacheData) {
      const skip = (page - 1) * limit;
      const recipes = await this.RecipeEntity.find()
        .skip(skip)
        .limit(limit)
        .populate('category', '-public_id')
        .select('-public_id')
        .sort({ createdAt: -1 });

      await this.cacheManager.set(this.cacheKey, recipes);

      return {
        page,
        totalPages,
        totalRecipes,
        data: recipes,
      };
    }

    return cacheData;
  }

  /**
   * Servicio para obtener receta por id
   * @param id - Id de la receta que se desea buscar
   * @returns Receta especifica buscada
   * @throws {HttpException} si la receta no existe
   */

  async findOne(id: string) {
    const recipe = await this.RecipeEntity.findById(id)
      .populate('category', '-public_id')
      .select('-public_id');

    if (!recipe) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND);
    }

    return recipe;
  }

  /**
   * obtener las ultimas 10 recetas agregadas
   * @returns Lista de las ultimas 10 recetas
   */
  async getLatestRecipes() {
    return await this.RecipeEntity.find().limit(10).sort({ createdAt: -1 });
  }

  /**
   * Servicio para buscar receta por nombre
   * @param name - Nombre de la receta que desea buscar
   * @returns Lista de recetas que tengan el nombre buscado
   * @throws Mensaje que indica que no hay recetas relacionadas con el nombre buscado
   */
  async searchByName(searchRecipeDto: SearchRecipeDto) {
    const query = { name: { $regex: searchRecipeDto.name, $options: 'i' } };

    const recipes = await this.RecipeEntity.find(query)
      .populate('category', '-public_id')
      .select('-public_id')
      .sort({ createdAt: -1 });
    if (recipes.length === 0) {
      return { message: 'No se encontraron recetas con ese nombre.' };
    }
    return recipes;
  }

  /**
   *  Servicio para obtener o filtrar todas las recetas de una categoría específica.
   * @param categoryId - ID de la categoría por la cual deseas filtrar las recetas.
   * @returns Lista de todas las recetas asociada a esa categoria
   * @throws Mensaje que indica que no hay recetas asociadas a esa catrgoria
   */
  async getRecipesByCategory(categoryId: string) {
    const recipes = await this.RecipeEntity.find({
      category: categoryId,
    })
      .select('-public_id')
      .populate('category', '-public_id')
      .exec();

    if (recipes.length === 0) {
      return { message: 'No hay recetas en esta categoria' };
    }
    return recipes;
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
      const cloudinaryResponse = await uploadImage(image.path, 'recipes');
      await fse.unlink(image.path);
      const newRecipe = new this.RecipeEntity({
        ...createRecipeDto,
        image: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      });
      newRecipe.save();
      if (this.cacheKey) {
        await this.cacheManager.del(this.cacheKey);

        this.cacheKey = '';
      }

      return {
        message: 'Receta creada correctamente',
        name: createRecipeDto.name,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al crear la receta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
    image: Express.Multer.File,
  ) {
    const recipeFound = await this.RecipeEntity.findById(id);
    if (!recipeFound) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND);
    }

    //actualizar la imagen
    if (image) {
      await deleteImage(recipeFound.public_id);
      const newImage = await uploadImage(image.path, 'recipes');
      await fse.unlink(image.path);
      updateRecipeDto.image = newImage.secure_url;
      updateRecipeDto.public_id = newImage.public_id;
    }

    await this.RecipeEntity.findByIdAndUpdate(id, updateRecipeDto);
    if (this.cacheKey) {
      await this.cacheManager.del(this.cacheKey);
      this.cacheKey = '';
    }
    return {
      message: 'Receta actualizada correctamente',
      name: updateRecipeDto.name,
    };
  }

  /**
   * Servicio para eliminar una receta existente.
   * @param id - ID de la receta que se desea eliminar.
   * @returns Un mensaje de éxito y el nombre de la receta eliminada.
   * @throws {HttpException} Si la receta no existe.
   */
  async remove(id: string) {
    const recipeFound = await this.RecipeEntity.findById(id);
    if (!recipeFound) {
      throw new HttpException('La receta no existe!', HttpStatus.NOT_FOUND);
    }
    await deleteImage(recipeFound.public_id);
    await this.RecipeEntity.findByIdAndDelete(id);
    if (this.cacheKey) {
      await this.cacheManager.del(this.cacheKey);
      this.cacheKey = '';
    }
    return {
      message: 'Receta eliminada correctamente',
      name: recipeFound.name,
    };
  }
}
