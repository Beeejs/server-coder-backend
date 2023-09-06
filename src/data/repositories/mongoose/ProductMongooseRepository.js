/* Model */
import { ProductModel } from '../../models/mongoose/productSchema.js';
/* Entities */
import Product from '../../../domain/entities/product.js';

class ProductMongooseRepository
{
  async list(limit, sort, type, page)
  {
    // eslint-disable-next-line no-unused-expressions
    type?.title ? type.title = { $regex: RegExp(type.title, 'i') } : null;

    const productsDocuments = await ProductModel.paginate(type, { limit: limit || 10, page, sort });

    if (productsDocuments.totalPages < page)
    {
      throw new Error(`The total pages is ${productsDocuments.totalPages}`);
    }

    const products = productsDocuments.docs.map(doc => new Product(
      {
        id: doc._id,
        title: doc.title,
        description: doc.description,
        price: doc.price,
        code: doc.code,
        stock: doc.stock,
        category: doc.category,
        enable: doc.enable
      }
    ));

    return {
      payload: products,
      ...productsDocuments
    };
  }

  async getOne(id)
  {
    const productDocument = await ProductModel.findById(id);

    return new Product({
      id: productDocument._id,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      code: productDocument.code,
      stock: productDocument.stock,
      category: productDocument.category,
      enable: productDocument.enable
    });
  }

  async create(data)
  {
    const newProdDoc = await ProductModel.create(data);

    return new Product({
      id: newProdDoc._id,
      title: newProdDoc.title,
      description: newProdDoc.description,
      price: newProdDoc.price,
      code: newProdDoc.code,
      stock: newProdDoc.stock,
      category: newProdDoc.category,
      enable: newProdDoc.enable
    });
  }

  async update(id, data)
  {
    const productDocument = await ProductModel.findByIdAndUpdate({ _id:id }, data);

    return new Product({
      id: productDocument._id,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      code: productDocument.code,
      stock: productDocument.stock,
      category: productDocument.category,
      enable: productDocument.enable
    });
  }

  async deleteOne(id)
  {
    const productDocument = await ProductModel.findByIdAndUpdate({ _id:id }, { enable: false });

    return new Product({
      id: productDocument._id,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      code: productDocument.code,
      stock: productDocument.stock,
      category: productDocument.category,
      enable: productDocument.enable
    });
  }
}

export default ProductMongooseRepository;
