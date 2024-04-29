import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ENUM } from 'src/common/enum';

export interface IClient extends Document {
  fullname: string;
  email: string;
  mobileNo: number;
  password: string;
}


export const ClientSchema = new mongoose.Schema(
  {
    fullName: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    mobileNo: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: ENUM.COLLECTIONS.CLIENT,
  },
);
