import { Schema, model } from 'mongoose';

const cartCollection = 'carts';

const cartModel = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId, index: true, ref: 'products', required: true
        },
        quantity: {
          type: Schema.Types.Number, default:1, required:true
        },

        type:Object
      }
    ],
    user: { type: Schema.Types.ObjectId, index: true, required: true } // ref: 'users' => NO porque es un endpoin publico
  },
  {
    versionKey: false
  }
);

export const CartModel = model(cartCollection, cartModel);
