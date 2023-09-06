/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

import DbFactory from '../../../data/factories/DbFactory.js';
import CartMongooseRepository from '../../../data/repositories/mongoose/CartMongooseRepository.js';
import ProductMongooseRepository from '../../../data/repositories/mongoose/ProductMongooseRepository.js';
/* Faker */
import { faker } from '@faker-js/faker';

describe('Start CartMongooseRepository Test', () =>
{
  let cartRepository;
  let productRepository;
  let idCart;
  let getProducts;
  const db = DbFactory.create();

  describe('Testing Cart Mongoose Repository', () =>
    {
      beforeAll(async() =>
        {
          await db.init(process.env.DB_TESTING);
          cartRepository = new CartMongooseRepository();
          productRepository = new ProductMongooseRepository();
        }
      );

      afterAll(async() =>
        {
          // await db.close();
          await db.drop();
        }
      );

      test('El repositorio debe ser una instacia de CartMongooseRepository', () =>
        {
          expect(cartRepository).toBeInstanceOf(CartMongooseRepository);
        }
      );

      test('El metodo "create" debe crear un Cart', async() =>
        {
          const cart = {
            products: []
          };

          const response = await cartRepository.create(cart);
          const { id, products } = response;

          expect(Array.isArray(products)).toStrictEqual(true);

          idCart = id;
        }
      );

      // Debo crear los productos aquí, asi me genera un id x el populate
      test('El metodo "addProduct" debe agregar un producto al Cart', async() =>
        {
          const products = [];
          for (let i = 0; i < 2; i++)
          {
            const responseProduct = await productRepository.create({
              title: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              price: faker.commerce.price(),
              code: faker.number.int({ min: 500, max: 1000 }),
              stock: faker.number.int({ min: 10, max: 50 }),
              category: faker.commerce.product(),
              enable: true
            });
            const { id, ...rest } = responseProduct;
            products.push({ product: { ...rest, _id: responseProduct.id }, quantity: faker.number.int({ min: 1, max: 20 }) });
          }

          const response = await cartRepository.addProduct(idCart, { products });

          expect(response.products.length).toStrictEqual(2);

          getProducts = products;
        }
      );


      test('El metodo "getOne" debe devolver un Cart', async() =>
        {
          const filter = { _id: idCart };

          const responseCart = await cartRepository.getOne(filter);

          const { id } = responseCart;

          expect(idCart).toStrictEqual(id);
        }
      );


      test('El metodo "deleteProduct" debe eliminar un producto del Cart', async() =>
        {
          getProducts.pop();

          const response = await cartRepository.deleteProduct(idCart, { products: getProducts });
          const { products } = response;

          expect(products.length).toStrictEqual(1);
        }
      );


      test('El metodo "cleanProducts" debe vacíar el Cart', async() =>
        {
          const response = await cartRepository.cleanProducts(idCart);
          const { products } = response;

          expect(products.length).toBeFalsy();
        }
      );
    }
  );
});
