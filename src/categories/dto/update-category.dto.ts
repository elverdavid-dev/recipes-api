import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString({ message: 'El nombre tiene que ser de tipo string!' })
  name?: string;

  image?: string;

  public_id?: string;
}
