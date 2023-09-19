import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Country {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  public_id: string;
}

export const CountryEntity = SchemaFactory.createForClass(Country);
