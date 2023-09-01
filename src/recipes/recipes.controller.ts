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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recetas' })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.recipesService.findAll(page, limit);
  }

  @Get('/latest')
  @ApiOperation({ summary: 'Obtener las ultimas 10 recetas agregadas' })
  getLatestRecipes() {
    return this.recipesService.getLatestRecipes();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Buscar recetas por nombre' })
  searchByName(@Query() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.searchByName(searchRecipeDto);
  }

  @Get('/filter')
  @ApiOperation({ summary: 'Filtrar todas las recetas de una categoria' })
  getRecipeByCategory(@Query('CategoryId') categoryId: string) {
    return this.recipesService.getRecipesByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener receta por id' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva receta' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter,
    }),
  )
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(createRecipeDto, image);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar receta por id' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter,
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.recipesService.update(id, updateRecipeDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar receta por id' })
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
