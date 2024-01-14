import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Country {
  @Prop({ required: true, lowercase: true })
  name: string

  @Prop({ required: true })
  image: string

  @Prop({ lowercase: true })
  slug: string

  @Prop()
  public_id: string
}

export const CountryEntity = SchemaFactory.createForClass(Country)
