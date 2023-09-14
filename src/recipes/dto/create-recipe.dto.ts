import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  @IsString({ message: 'El nombre debe ser un texto!' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es requerida!' })
  @IsString({ message: 'La descripción debe ser un texto!' })
  description: string;

  @IsNotEmpty({ message: 'Los lista de ingredientes es requerida!' })
  @IsArray({
    message: 'Los ingredientes deben ser proporcionados como una lista!',
  })
  @ArrayNotEmpty({ message: 'La lista de ingredientes no puede estar vacía!' })
  ingredients: string[];

  @IsNotEmpty({ message: 'La lista de pasos es requerida!' })
  @IsArray({ message: 'Los pasos deben ser proporcionados como una lista!' })
  @ArrayNotEmpty({ message: 'La lista de pasos no puede estar vacía!' })
  steps: string[];

  @IsOptional()
  @IsString({ message: 'La region debe ser un texto' })
  country?: string;

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsString({ message: 'La categoría debe ser un texto' })
  category: string;

  file: Express.Multer.File;
}
