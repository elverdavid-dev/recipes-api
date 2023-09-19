import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CountrysService } from './countrys.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from '../utils/fileUpload';

@Controller('countrys')
export class CountrysController {
  constructor(private readonly countrysService: CountrysService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload',
      }),
      fileFilter,
    }),
  )
  create(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.countrysService.create(createCountryDto, image);
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
