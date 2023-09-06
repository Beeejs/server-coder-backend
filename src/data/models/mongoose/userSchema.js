import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userModel = new Schema(
  {
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    age: { type: Schema.Types.Number, default: 18 },
    email: { type: Schema.Types.String, unique: true, required: true, index: true },
    password: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'roles', index: true, required: true },
    last_connection: { type: Schema.Types.Date, required: false },
    enable: { type: Schema.Types.Boolean, default: true }
  },
  {
    versionKey: false
  }
);

userModel.plugin(mongoosePaginate);

export const UserModel = model(userCollection, userModel);
