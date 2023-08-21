import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  name?: string;

  image?: string;

  public_id?: string;
}
