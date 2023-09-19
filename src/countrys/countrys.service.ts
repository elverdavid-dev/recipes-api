import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './entities/country.entity';
import { Model } from 'mongoose';

@Injectable()
export class CountrysService {
  constructor(
    @InjectModel(Country.name) private CountryEntity: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const newCountry = await this.CountryEntity.create(createCountryDto);
    return newCountry.save();
  }

  async findAll() {
    return await this.CountryEntity.find();
  }

  async findOne(id: number) {
    return await this.CountryEntity.findById(id);
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    return this.CountryEntity.findByIdAndUpdate(id, updateCountryDto);
  }

  async remove(id: number) {
    return await this.CountryEntity.findByIdAndDelete(id);
  }
}
