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
import { ApiTags } from '@nestjs/swagger';
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
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.recipesService.findAll(page, limit);
  }

  @Get('/latest')
  getLatestRecipes() {
    return this.recipesService.getLatestRecipes();
  }

  @Get('/search')
  searchByName(@Query() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.searchByName(searchRecipeDto);
  }

  @Get('/filter')
  getRecipeByCategory(@Query('CategoryId') categoryId: string) {
    return this.recipesService.getRecipesByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
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
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
