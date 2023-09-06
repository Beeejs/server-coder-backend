import container from '../../container.js';
/* Zod */
import { idValidation } from '../validations/idValidation.js';
import { productCreateValidator, productUpdateValidator  } from '../validations/product/productValidation.js';

class ProductManager
{
  constructor()
  {
    this.productRepository = container.resolve('ProductRepository');
  }

  async list(limit, sort, type, page)
  {
    sort = sort ? sort === 'asc' ? { price:1 } : (sort === 'desc' ? { price:-1 } : 'invalid') : null;

    if (sort === 'invalid')
    {
      throw new Error('The sort query is invalid.');
    }

    return await this.productRepository.list(limit, sort, type, page);
  }

  async getOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.productRepository.getOne(id);
  }

  async create(data)
  {
    await productCreateValidator.parseAsync(data);

    return await this.productRepository.create(data);
  }

  async update(id, data)
  {
    await idValidation.parseAsync(id);
    await productUpdateValidator.parseAsync(data);

    return await this.productRepository.update(id, data);
  }

  async deleteOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.productRepository.deleteOne(id);
  }
}

export default ProductManager;
