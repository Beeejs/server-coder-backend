/* Model */
import { CartModel } from '../../models/mongoose/cartsSchema.js';
/* Entities */
import Cart from '../../../domain/entities/cart.js';

class CartMongooseRepository
{
  async getOne(id)
  {
    const cartDocument = await CartModel.findById(id)
      .populate({ path: 'products.product', model: 'products' }); // Al hacer addProduct en la db se me guarda el producto entero

    if (!cartDocument)
    {
      throw new Error(`'Cart with id:${id} don't exist.'`);
    }

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }

  async getOneByUser(id)
  {
    const cartDocument = await CartModel.findOne({ user: id })
      .populate('user');

    if (!cartDocument) return null;

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }


  async create(data)
  {
    const newCartDoc = await CartModel.create(data);

    return new Cart({
      id: newCartDoc._id,
      products: newCartDoc.products,
      user: newCartDoc.user
    });
  }

  async addProduct(cId, data)
  {
    const cartDocument = await CartModel.findByIdAndUpdate({ _id: cId }, data, { new: true });

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }

  async cleanProducts(cId)
  {
    const cartDocument = await CartModel.findOneAndUpdate(
      { _id: cId },
      { $set: { products:[] } },
      { new: true }
    );

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }

  async deleteProduct(cId, data)
  {
    const cartDocument = await CartModel.findByIdAndUpdate({ _id: cId }, data, { new: true });

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }

  async deleteAllProduct(cId, data)
  {
    const cartDocument = await CartModel.findOneAndUpdate({ _id: cId }, data, { new: true });

    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
      user: cartDocument.user
    });
  }
}

export default CartMongooseRepository;
