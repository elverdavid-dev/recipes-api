import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  name: string;
  image: string;
}
