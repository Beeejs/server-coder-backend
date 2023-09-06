/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

import DbFactory from '../../../data/factories/DbFactory.js';
import ProductMongooseRepository from '../../../data/repositories/mongoose/ProductMongooseRepository.js';
/* Faker */
import { faker } from '@faker-js/faker';

describe('Start ProductMongooseRepository Test', () =>
{
  let productRepository;
  let idProduct;
  const db = DbFactory.create();

  describe('Testing Product Mongoose Repository', () =>
  {
    beforeAll(async() =>
      {
        await db.init(process.env.DB_TESTING);
        productRepository = new ProductMongooseRepository();
      }
    );


    afterAll(async() =>
      {
        // await db.close();
        await db.drop();
      }
    );


    test('El repositorio debe ser una instacia de ProductMongooseRepository', () =>
      {
        expect(productRepository).toBeInstanceOf(ProductMongooseRepository);
      }
    );


    test('El metodo "list" debe devolver un arreglo de products', async() =>
      {
        const response = await productRepository.list();
        const { payload } = response;

        expect(Array.isArray(payload)).toStrictEqual(true);
      }
    );


    test('El metodo "create" debe crear un Product', async() =>
      {
        const product = {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          code: faker.number.int({ min: 500, max: 1000 }),
          stock: faker.number.int({ min: 10, max: 50 }),
          category: faker.commerce.product(),
          enable: true
        };

        const response = await productRepository.create(product);

        const { id, title } = response;
        expect(product.title).toStrictEqual(title);

        idProduct = id;
      }
    );


    test('El metodo "getOne" debe devolver un Product', async() =>
      {
        const filter = { _id: idProduct };

        const response = await productRepository.getOne(filter);
        const { id } = response;

        expect(idProduct).toStrictEqual(id);
      }
    );


    test('El metodo "update" debe modificar un Product', async() =>
      {
        const data = {
          price: faker.commerce.price(),
          stock: faker.number.int({ min: 10, max: 100 })
        };

        const response = await productRepository.update(idProduct, data);
        const { title } = response;

        expect(data.title).not.toBe(title);
      }
    );


    test('El metodo "deleteOne" debe modificar su propiedad "enable" a false', async() =>
      {
        const response = await productRepository.deleteOne(idProduct);
        const { id } = response;

        expect(id).toStrictEqual(idProduct);
      }
    );
  });
});
