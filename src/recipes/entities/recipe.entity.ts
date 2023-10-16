//eslint-disable-next-line prettier/prettier
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';
import { Country } from 'src/countrys/entities/country.entity';
@Schema({ timestamps: true, versionKey: false })
export class Recipe {
  @Prop({ trim: true, lowercase: true, required: true })
  name: string;

  @Prop({ trim: true, lowercase: true, required: true })
  description: string;

  @Prop({ required: true, lowercase: true })
  ingredients: string[];

  @Prop({ required: true, lowercase: true })
  steps: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country?: Country;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  portions: number;

  @Prop({ required: true })
  image: string;

  @Prop()
  public_id: string;
}

export const RecipeEntity = SchemaFactory.createForClass(Recipe);
