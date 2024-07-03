import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Recipe, RecipeEntity } from './entities/recipe.entity'
import { RecipesController } from './recipes.controller'
import { RecipesService } from './recipes.service'
import { CludinaryModule } from '@/config/cloudinary/cludinary/cludinary.module'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeEntity }]),
    CludinaryModule
  ],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule {}
