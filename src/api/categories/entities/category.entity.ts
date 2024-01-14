import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: true, lowercase: true })
  name: string

  @Prop({ required: true })
  image: string

  @Prop({ lowercase: true })
  slug: string

  @Prop()
  public_id: string
}

export const CategoryEntity = SchemaFactory.createForClass(Category)
