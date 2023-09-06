import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productModel = new Schema(
  {
    title : { type: Schema.Types.String, required: true },
    description : { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    code: { type: Schema.Types.Number, required: true, unique: true, index: true },
    stock: { type: Schema.Types.Number, required: true },
    category: { type: Schema.Types.String, required: true },
    enable: { type: Schema.Types.Boolean, default: true }
  },
  {
    versionKey: false
  }
);

productModel.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productModel);
