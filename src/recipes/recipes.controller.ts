import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { fileFilter } from '../utils/fileUpload';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';

@ApiTags('Recetas')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  /**
   * @description Controlador de el servicio de obtener todas las recetas.
   */

  @Get()
  //Documentacion
  @ApiOperation({ summary: 'Obtener todas las recetas' })
  @ApiQuery({
    name: 'page',
    description: 'agrega la pagina que se desea ver por ejemplo la pagina 1',
    required:false
  })
  @ApiQuery({
    name: 'limit',
    description:
      'limite de recetas por pagina que se desea ver, por ejemplo 10 recetas por paginas',
      required:false
  })
  //Controlador
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.recipesService.findAll(page, limit);
  }

  /**
   * @description Controlador de el servicio de obtener las ultimas recetas agregadas.
   */

  @Get('/latest')
  @ApiOperation({ summary: 'Obtener las ultimas recetas agregadas' })
  @ApiQuery({
    name: 'limit',
    description:
      'Limite de las ultimas recetas agregada que desea ver por ejemplo las ultimas 10',
  })
  getLatestRecipes(@Query('limit', ParseIntPipe) limit: number) {
    return this.recipesService.getLatestRecipes(limit);
  }

  /**
   * @description Controlador de el servicio de buscar recetas por nombre.
   */

  @Get('/search')
  @ApiOperation({ summary: 'Buscar recetas por nombre' })
  @ApiQuery({
    name: 'name',
    description: 'Nombre de la receta que se desea buscar',
  })
  searchByName(@Query() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.searchByName(searchRecipeDto);
  }

  /**
   * @description Controlador de el servicio de buscar todas las recetas relacionada a una categoria.
   */

  @Get('/filter/categories')
  //Documentacion
  @ApiOperation({ summary: 'Filtrar todas las recetas de una categoria' })
  @ApiQuery({
    name: 'CategoryId',
    description:
      'Id de la categoria por la cual desea buscar las recetas relacionadas a esa categoria',
  })
  @ApiQuery({
    name: 'page',
    description: 'agrega la pagina que se desea ver por ejemplo la pagina 1',
  })
  @ApiQuery({
    name: 'limit',
    description:
      'limite de recetas por pagina que se desea ver, por ejemplo 10 recetas por paginas',
  })
  //Controlador
  getAllRecipesOneCategory(
    @Query('CategoryId') categoryId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.recipesService.getAllRecipesOneCategory(
      categoryId,
      page,
      limit,
    );
  }

  /**
   * @description Controlador de el servicio de buscar todas las recetas relacionada a una región.
   */

  @Get('filter/countrys')
  @ApiOperation({ summary: 'Filtrar todas las recetas de un pais o region' })
  @ApiQuery({
    name: 'countryId',
    description:
      'Id de la región por la cual desea buscar las recetas relacionadas a esa región',
  })
  getAllRecipesOneCountry(@Query('countryId') countryId: string) {
    return this.recipesService.getAllRecipesOneCountry(countryId);
  }
  /**
   * @description Controlador de el servicio de obtener una receta por el id.
   */

  @Get(':id')
  @ApiOperation({ summary: 'Obtener receta por id' })
  @ApiParam({ name: 'id', description: 'Id de la receta que se desea buscar' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  /**
   * @description Controlador de el servicio de crear una nueva receta.
   */

  @Post()
  //Subir imagen
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter,
    }),
  )
  //Documentacion
  @ApiOperation({ summary: 'Crear nueva receta' })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()
  //Controlador
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(createRecipeDto, image);
  }

  /**
   * @description Controlador de el servicio de actualizar una receta por id.
   */

  @Put(':id')
  //Actualizar imagen
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter,
    }),
  )
  //Documentacion
  @ApiOperation({
    summary: 'Actualizar receta por id',
    description: 'Puede actualizar una a varias propiedades',
  })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()
  @ApiParam({
    name: 'id',
    description: 'Id de las receta que se desa actualizar',
  })
  //Controlador
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.recipesService.update(id, updateRecipeDto, image);
  }

  /**
   * @description Controlador de el servicio de eliminar una receta por id.
   */

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar receta por id' })
  @ApiExcludeEndpoint()
  @ApiParam({
    name: 'id',
    description: 'Id de la receta que se desea eliminar',
  })
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
