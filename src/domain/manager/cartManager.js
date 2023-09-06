import container from '../../container.js';
/* Zod */
import { idValidation } from '../validations/idValidation.js';
import { quantityValidation, isStock } from '../validations/cart/cartValidation.js';

class CartManager
{
  constructor()
  {
    this.cartRepository = container.resolve('CartRepository');
    this.productRepository = container.resolve('ProductRepository');
  }

  async getOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.cartRepository.getOne(id);
  }

  async getOneByUser(id)
  {
    await idValidation.parseAsync(id);

    const getCart = await this.cartRepository.getOneByUser(id);

    if (!getCart) throw new Error(`Cart with userId:${id} don't exist.`);

    const { _id, firstName, email } = getCart.user;

    const payload = {
      ...getCart,
      user: {
        _id,
        firstName,
        email
      }
    };

    return payload;
  }

  async create(data)
  {
    const user = await this.cartRepository.getOneByUser(data.user);

    if (user) throw new Error('Cart already exists.');

    return await this.cartRepository.create(data);
  }

  async addProduct(cId, pId, quantity)
  {
    await idValidation.parseAsync(cId);
    await idValidation.parseAsync(pId);
    await quantityValidation.parseAsync(quantity);

    const productDocument = await this.productRepository.getOne(pId);
    const cartDocument = await this.cartRepository.getOne(cId);
    if (!productDocument || !cartDocument)
    {
      throw new Error('Cart or Product dont exist.');
    }

    const condition = cartDocument.products.some(({ product }) => product._id.toString() === pId);

    if (!condition)
    {
      cartDocument.products.push({ product: pId, quantity: quantity || 1 });

      const productCart = cartDocument.products.find(({ product }) => (product || product._id.toString()) === pId);
      await isStock.parseAsync({ quantity: productCart.quantity, stock: productDocument.stock });

      return await this.cartRepository.addProduct(cId, cartDocument);
    }

    cartDocument.products.map(p => p.product._id.toString() === pId ? p.quantity = p.quantity + (quantity || 1) : p.quantity);

    const productCart = cartDocument.products.find(p => p.product._id.toString() === pId);
    await isStock.parseAsync({ quantity: productCart.quantity, stock: productDocument.stock });

    return await this.cartRepository.addProduct(cId, cartDocument);
  }

  async cleanProducts(cId)
  {
    await idValidation.parseAsync(cId);

    return await this.cartRepository.cleanProducts(cId);
  }

  async deleteProduct(cId, pId)
  {
    await idValidation.parseAsync(cId);
    await idValidation.parseAsync(pId);

    const productDocument = await this.productRepository.getOne(pId);
    const cartDocument = await this.cartRepository.getOne(cId);

    if (!productDocument || !cartDocument)
    {
      throw new Error('Cart or Product dont exist.');
    }

    cartDocument.products.map(async(p) =>
      {
        const { product, quantity } = p;

        const condition = product._id.toString() === pId;

        if (!condition) return;

        if (quantity > 1) return p.quantity = quantity - 1;

        await this.deleteAllProduct(cId, pId);
      }
    );

    return await this.cartRepository.addProduct(cId, cartDocument);
  }

  async deleteAllProduct(cId, pId)
  {
    await idValidation.parseAsync(cId);
    await idValidation.parseAsync(pId);

    const productDocument = await this.productRepository.getOne(pId);
    const cartDocument = await this.cartRepository.getOne(cId);

    if (!productDocument || !cartDocument) throw new Error('Cart or Product dont exist.');

    const newArrayOfProducts = cartDocument.products.filter(({ product }) => product._id.toString() !== pId);
    cartDocument.products = newArrayOfProducts;

    return await this.cartRepository.deleteProduct(cId, cartDocument);
  }

  async purchase(cId)
  {
    await idValidation.parseAsync(cId);
    const cartDocument = await this.cartRepository.getOne(cId);

    if (!cartDocument) throw new Error('The cart dont exist.');

    const products = [];

    for (const { product, quantity } of cartDocument.products)
    {
      const productDocument = await this.productRepository.getOne(product._id);

      if (productDocument.stock < quantity) throw new Error(`The purchase was cancelled. The product "${product.title}" does not have the amount of stock you requested. Please remove the product from the cart or lower your order quantity.`);

      products.push({ ...productDocument, quantity });
    }

    products.map(async(product) =>
      {
        const newStock = product.stock - product.quantity;

        const data = {
          stock: newStock,
          enable: newStock === 0 ? false : true
        };

        await this.productRepository.update(product.id, data);
      }
    );

    await this.cartRepository.cleanProducts(cId);

    return cartDocument;
  }
}

export default CartManager;
