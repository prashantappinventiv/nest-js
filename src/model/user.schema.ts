import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/providers/database';
@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
