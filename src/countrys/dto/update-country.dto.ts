import { PartialType } from '@nestjs/swagger';
import { CreateCountryDto } from './create-country.dto';
import { IsString } from 'class-validator';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  name?: string;

  image?: string;

  public_id?: string;
}
