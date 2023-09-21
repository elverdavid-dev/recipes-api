import { Module } from '@nestjs/common';
import { CountrysService } from './countrys.service';
import { CountrysController } from './countrys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountryEntity } from './entities/country.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountryEntity }]),
  ],
  controllers: [CountrysController],
  providers: [CountrysService],
})
export class CountrysModule {}
