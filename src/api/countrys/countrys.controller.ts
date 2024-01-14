import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import { fileFilter } from '@utils/fileUpload'
import { diskStorage } from 'multer'
import { CountrysService } from './countrys.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'

@Controller('countrys')
@ApiTags('Regiones')
export class CountrysController {
  constructor(private readonly countrysService: CountrysService) {}

  /**
   * @description Controlador de el servicio de obtener todas las regiones.
   */

  @Get()
  //Documentacion
  @ApiOperation({
    summary: 'Obtener todas las regiones'
  })
  @ApiQuery({
    name: 'page',
    description:
      'agrega la pagina que se desea ver por ejemplo la pagina 1, por defecto es 1',
    required: false
  })
  @ApiQuery({
    name: 'limit',
    description:
      'limite de regiones por pagina que se desea ver, por ejemplo 5 regiones por paginas, por defecto es 20',
    required: false
  })
  //Controlador
  findAll(
    @Query('page') page: string | number = 1,
    @Query('limit') limit: string | number = 20
  ) {
    // Si no se pasan las consultas, se utilizan los valores por defecto que son de tipo number.
    // En caso de que se pasen las consultas, los valores son de tipo string y se convierten a number.
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page
    const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit

    return this.countrysService.findAll(pageNumber, limitNumber)
  }

  /**
   * @description Controlador de el servicio de buscar un pais por el slug
   */

  @Get(':slug')
  @ApiOperation({
    summary: 'Obtener un pais por el slug ejemplo (republica-dominicana)'
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.countrysService.findBySlug(slug)
  }

  /**
   * @description Controlador de el servicio de obtener una región por id.
   */

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una region por id'
  })
  @ApiParam({ name: 'id', description: 'Id de la region que se desea obtener' })
  findOne(@Param('id') id: string) {
    return this.countrysService.findOne(id)
  }

  /**
   * @description Controlador de el servicio de crear una nueva región.
   */

  @Post()
  // Subir imagen
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload'
      }),
      fileFilter
    })
  )
  // Documentación
  @ApiOperation({
    summary: 'Crear una nueva region',
    description:
      'con este servicio se puede crear una nueva region que puede estar relacionada a una receta , por ejemplo una receta que sea originaria de una región o un pais'
  })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()

  //Controlador
  create(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFile()
    image: Express.Multer.File
  ) {
    return this.countrysService.create(createCountryDto, image)
  }

  /**
   * @description Controlador de el servicio de actualizar una región por id.
   */
  @Put(':id')
  //Subida de imagene
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter
    })
  )
  //Documentacion
  @ApiOperation({
    summary: 'Actualizar una region por id'
  })
  @ApiParam({
    name: 'id',
    description: 'Id de la region que se desea actualizar'
  })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()
  //Controlador
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @UploadedFile()
    image: Express.Multer.File
  ) {
    return this.countrysService.update(id, updateCountryDto, image)
  }

  /**
   * @description Controlador de el servicio de eliminar una region por id.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una region por id' })
  @ApiExcludeEndpoint()
  @ApiParam({
    name: 'id',
    description: 'Id de la region que se desea eliminar'
  })
  remove(@Param('id') id: string) {
    return this.countrysService.remove(id)
  }
}
