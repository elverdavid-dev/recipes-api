import { CategoriesModule } from '@/api/categories/categories.module'
import { CountriesModule } from '@/api/countries/countries.module'
import { RecipesModule } from '@/api/recipes/recipes.module'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { CloudinaryConfigProvider } from './config/cloudinary.config'
import { CloudinaryService } from './config/cloudinary/cloudinary.service';
import { CludinaryModule } from './config/cloudinary/cludinary/cludinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRoot(process.env.URI_DB),
    CacheModule.register({ isGlobal: true, ttl: 60000, store: 'memory' }),
    RecipesModule,
    CategoriesModule,
    CountriesModule,
    CludinaryModule
  ],
  controllers: [],
  providers: [CloudinaryConfigProvider, CloudinaryService]
})
export class AppModule { }
