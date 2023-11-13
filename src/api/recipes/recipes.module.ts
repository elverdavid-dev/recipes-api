import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Recipe, RecipeEntity } from './entities/recipe.entity'
import { RecipesController } from './recipes.controller'
import { RecipesService } from './recipes.service'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeEntity }])
  ],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule {}
