//eslint-disable-next-line prettier/prettier
import { Category } from '@/api/categories/entities/category.entity'
import { Country } from '@/api/countrys/entities/country.entity'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
@Schema({ timestamps: true, versionKey: false })
export class Recipe {
  @Prop({ trim: true, lowercase: true, required: true })
  name: string

  @Prop({ trim: true, lowercase: true, required: true })
  description: string

  @Prop({ required: true, lowercase: true })
  ingredients: string[]

  @Prop({ required: true, lowercase: true })
  steps: string[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country?: Country

  @Prop({ required: true })
  duration: number

  @Prop({ required: true })
  portions: number

  @Prop({ required: true })
  image: string

  @Prop()
  public_id: string

  @Prop({ lowercase: true })
  slug: string
}

export const RecipeEntity = SchemaFactory.createForClass(Recipe)
