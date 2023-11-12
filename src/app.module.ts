import { CategoriesModule } from '@/api/categories/categories.module'
import { CountrysModule } from '@/api/countrys/countrys.module'
import { RecipesModule } from '@/api/recipes/recipes.module'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
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
