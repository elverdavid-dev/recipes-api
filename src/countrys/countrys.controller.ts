import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { CountrysService } from './countrys.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from '../utils/fileUpload';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('countrys')
@ApiTags('Regiones')
export class CountrysController {
  constructor(private readonly countrysService: CountrysService) {}

  /**
   * @description Controlador de el servicio de obtener todas las regiones.
   */

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las regiones',
  })
  findAll() {
    return this.countrysService.findAll();
  }

  /**
   * @description Controlador de el servicio de obtener una región por id.
   */

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una region por id',
  })
  @ApiParam({ name: 'id', description: 'Id de la region que se desea obtener' })
  findOne(@Param('id') id: string) {
    return this.countrysService.findOne(id);
  }

  /**
   * @description Controlador de el servicio de crear una nueva región.
   */

  @Post()
  // Subir imagen
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload',
      }),
      fileFilter,
    }),
  )
  // Documentación
  @ApiOperation({
    summary: 'Crear una nueva region',
    description:
      'con este servicio se puede crear una nueva region que puede estar relacionada a una receta , por ejemplo una receta que sea originaria de una región o un pais',
  })
  @ApiConsumes('multipart/form-data')

  //Controlador
  create(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.countrysService.create(createCountryDto, image);
  }

  /**
   * @description Controlador de el servicio de actualizar una región por id.
   */
  @Put(':id')
  //Subida de imagene
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter,
    }),
  )
  //Documentacion
  @ApiOperation({
    summary: 'Actualizar una region por id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id de la region que se desea actualizar',
  })
  @ApiConsumes('multipart/form-data')
  //Controlador
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.countrysService.update(id, updateCountryDto, image);
  }

  /**
   * @description Controlador de el servicio de eliminar una region por id.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una region por id' })
  @ApiParam({
    name: 'id',
    description: 'Id de la region que se desea eliminar',
  })
  remove(@Param('id') id: string) {
    return this.countrysService.remove(id);
  }
}
