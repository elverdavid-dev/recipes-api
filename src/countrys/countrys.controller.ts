import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountrysService } from './countrys.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('countrys')
export class CountrysController {
  constructor(private readonly countrysService: CountrysService) {}

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countrysService.create(createCountryDto);
  }

  @Get()
  findAll() {
    return this.countrysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countrysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countrysService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countrysService.remove(+id);
  }
}
