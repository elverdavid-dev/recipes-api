import { IsNotEmpty, IsString } from 'class-validator';

export class SearchRecipeDto {
  @IsNotEmpty({ message: 'El nombre de la receta es requerido!' })
  @IsString({ message: 'El nombre de la receta debe ser un texto!' })
  name: string;
}
