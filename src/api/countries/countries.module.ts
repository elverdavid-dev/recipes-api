import { Module } from '@nestjs/common'
import { CountriesService } from './countries.service'
import { CountriesController } from './countries.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Country, CountryEntity } from './entities/country.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountryEntity }])
  ],
  controllers: [CountriesController],
  providers: [CountriesService]
})
export class CountriesModule { }
