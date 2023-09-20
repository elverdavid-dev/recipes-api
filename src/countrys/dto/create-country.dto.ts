import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  @ApiProperty({ description: 'Nombre de la region que va a crear' })
  name: string;

  @ApiProperty({
    description:
      'Al agregar una imagen de cualquiera de estos tipo png,svg,jpg,jpge,webp,avif , se guardara en el servicio en la nube de cloudinary , esto generara una url que es la que se guardara en la base de datos',
  })
  image: string;
}
