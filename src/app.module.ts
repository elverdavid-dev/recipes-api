import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesModule } from './categories/categories.module'
import { CountrysModule } from './countrys/countrys.module'
import { RecipesModule } from './recipes/recipes.module'
import { CloudinaryConfigProvider } from './utils/cloudinary.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRoot(process.env.URI_DB),
    CacheModule.register({ isGlobal: true, ttl: 60000, store: 'memory' }),
    RecipesModule,
    CategoriesModule,
    CountrysModule
  ],
  controllers: [],
  providers: [CloudinaryConfigProvider]
})
export class AppModule {}
