import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { CreateCategoryDto } from './create-category.dto'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  @ApiProperty({ description: 'Nuevo nombre' })
  name?: string

  @ApiProperty({
    description:
      'Al actualizar una imagen debe de tener en cuenta que la nueva imagen sea de cualquiera de estos tipo png,svg,jpg,jpge,webp,avif , la url que estaba en la base de datos se actualizara y se guardara la nueva url de la nueva imagen'
  })
  image?: string

  @ApiProperty({
    description:
      'Esta propiedad se agregara automaticamente al guardarse una imagen , sirve para poder encontrar la imagen en el servicio de cloudinary y poder actualizar la imagen'
  })
  public_id?: string
}
