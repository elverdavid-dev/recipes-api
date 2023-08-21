import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  public_id: string;
}

export const CategoryEntity = SchemaFactory.createForClass(Category);
