import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { fileFilter } from 'src/utils/fileUpload'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * @description Controlador de el servicio de obtener todas las categorias.
   */

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorias' })
  findAll() {
    return this.categoriesService.findAll()
  }

  /**
   * @description Controlador de el servicio de obtener una categoria por id.
   */

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoria por id' })
  @ApiParam({
    name: 'id',
    description: 'Id de la categoria que se desea obtener por id'
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  /**
   * @description Controlador de el servicio de crear una nueva categoria.
   */

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoria' })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload'
      }),
      fileFilter
    })
  )
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile()
    image: Express.Multer.File
  ) {
    return this.categoriesService.create(createCategoryDto, image)
  }

  /**
   * @description Controlador de el servicio de actualizar categoria por id.
   */

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar categoria por id' })
  @ApiConsumes('multipart/form-data')
  @ApiExcludeEndpoint()
  @ApiParam({
    name: 'id',
    description: 'Id de la categoria que se desea actualizar'
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination: './upload' }),
      fileFilter
    })
  )
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.categoriesService.update(id, updateCategoryDto, image)
  }

  /**
   * @description Controlador de el servicio de eliminar una categoria por id.
   */

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoria por id' })
  @ApiExcludeEndpoint()
  @ApiParam({
    name: 'id',
    description: 'Id de la categoria que se desea Eliminar'
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}
