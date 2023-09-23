import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  @IsString({ message: 'El nombre debe ser un texto!' })
  @ApiProperty({ description: 'Nombre de la receta que va a ser creada' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es requerida!' })
  @IsString({ message: 'La descripción debe ser un texto!' })
  @ApiProperty({ description: 'Descripcion sobre la receta' })
  description: string;

  @IsNotEmpty({ message: 'Los lista de ingredientes es requerida!' })
  @IsArray({
    message: 'Los ingredientes deben ser proporcionados como una lista!',
  })
  @ArrayNotEmpty({ message: 'La lista de ingredientes no puede estar vacía!' })
  @ApiProperty({
    description: 'Lista de los ingredientes usados en la receta',
  })
  ingredients: string[];

  @IsNotEmpty({ message: 'La lista de pasos es requerida!' })
  @IsArray({ message: 'Los pasos deben ser proporcionados como una lista!' })
  @ArrayNotEmpty({ message: 'La lista de pasos no puede estar vacía!' })
  @ApiProperty({ description: 'Lista de pasos a seguir para hacer la receta' })
  steps: string[];

  @IsOptional()
  @IsMongoId({ message: 'Country tiene que ser de tipo objectId' })
  @ApiProperty({
    description:
      'Esta propiedad es opcional , y sirve para relacionar la receta con alguna de las regiones creada, en caso de que la receta sea tipica de esa region o se originaria de esa region o pais, se debe agregar el id de la region que desea relacionar con la receta',
  })
  country?: Types.ObjectId;

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsMongoId({ message: 'Category tiene que ser de tipo objectId' })
  @ApiProperty({
    description:
      'Se debe agregar el id alguna de la categorias creadas, para relacionar una categoria con la receta que se esta creando ',
  })
  category: Types.ObjectId;

  @ApiProperty({
    description:
      'Al agregar una imagen de cualquiera de estos tipo png,svg,jpg,jpge,webp,avif , se guardara en el servicio en la nube de cloudinary , esto generara una url que es la que se guardara en la base de datos',
  })
  @IsNotEmpty({ message: 'La duracion es requerida!' })
  // @IsNumber()
  duration: number;

  image: Express.Multer.File | string;
}
