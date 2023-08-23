import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';
@Schema({ timestamps: true, versionKey: false })
export class Recipe {
  @Prop({ trim: true, lowercase: true, required: true })
  name: string;

  @Prop({ trim: true, lowercase: true, required: true })
  description: string;

  @Prop({ type: [String], required: true, lowercase: true })
  ingredients: string[];

  @Prop({ type: [String], required: true, lowercase: true })
  steps: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ required: true })
  image: string;

  @Prop()
  public_id: string;
}

export const RecipeEntity = SchemaFactory.createForClass(Recipe);
