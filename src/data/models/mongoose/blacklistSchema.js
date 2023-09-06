import { Schema, model } from 'mongoose';

const BlistCollection = 'blacklist';

const blackListModel = new Schema(
  {
    token: { type: Schema.Types.String, required: true }
  },
  {
    versionKey: false
  }
);


export const BlackListModel = model(BlistCollection, blackListModel);
