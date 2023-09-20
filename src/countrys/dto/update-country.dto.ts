import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountryDto } from './create-country.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  @IsOptional()
  @ApiProperty({ description: 'Nombre de la region que va a actualizar' })
  name?: string;

  @IsOptional()
  @ApiProperty({
    description:
      'Al actualizar  una imagen debe de tener en cuenta que la nueva imagen sea  de cualquiera de estos tipo png,svg,jpg,jpge,webp,avif , la  url que estaba en la base de datos se actualizara y se guardara la nueva url de la nueva imagen',
  })
  image?: string;

  @ApiProperty({
    description:
      'Esta propiedad se agregara automaticamente al guardarse una imagen , sirve para poder encontrar la imagen en el servicio de cloudinary y poder actualizar la imagen',
  })
  @IsOptional()
  public_id?: string;
}
