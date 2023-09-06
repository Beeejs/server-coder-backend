/* Test Server */
import TestIntSetUp from '../../utils/testIntSetUp.js';
/* Test Integration SetUp */
import initTestServer from '../index.js';


describe('Start Carts Endpoints Test', () =>
{
  let request;
  let dataBase;

  const urlApi = '/api/carts';

  let idCart;
  let idProduct;
  let token = '';

  beforeAll(async() =>
    {
      const { requester, db } = await initTestServer();
      dataBase = db;
      request = requester;
    }
  );

  afterAll(async() =>
    {
      // await dataBase.close();
      await dataBase.drop();
    }
  );

  describe('Success Carts Test', () =>
  {
    beforeAll(async() =>
      {
          const testSetUp = new TestIntSetUp();

          await testSetUp.createRole('admin');
          await testSetUp.userSingUp(request);
          token = await testSetUp.userLogin();
      }
    );


    test('Crear carrito | "/"', async() =>
      {
        const cart = {
          products: []
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(cart);

        const { _body, status } = response;
        const { newCart } = _body;

        expect(status).toStrictEqual(200);
        expect(Array.isArray(newCart.products)).toStrictEqual(true);

        idCart = newCart.id;
      }
    );


    test('Obtener carrito | "/:cId"', async() =>
      {
        const response = await request
              .get(`${urlApi}/${idCart}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { cartId } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(cartId).toStrictEqual(idCart);
      }
    );


    test('Agregar producto | "/:cId/products/:pId"', async() =>
      {
        const payload = {
          title: 'ProductTest-cart',
          description: 'ProductTest-cart-description',
          price: 100,
          code: 123,
          stock: 10,
          category: 'category',
          enable: true
        };

        const responseProduct = await request
              .post('/api/products/')
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        expect(responseProduct.status).toStrictEqual(200);
        expect(responseProduct._body.status).toStrictEqual('success');
        expect(responseProduct._body.newProduct.title).toStrictEqual(payload.title);

        idProduct = responseProduct._body.newProduct.id;


        const response = await request
              .put(`${urlApi}/${idCart}/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ quantity: 2 });

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual('Cart updated.');
      }
    );


    test('Limpiar carrito | "/:cId"', async() =>
      {
        const response = await request
              .put(`${urlApi}/${idCart}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual('Cart updated.');
      }
    );


    test('Eliminar producto | "/:cId/products/:pId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idCart}/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual('Product deleted.');
      }
    );


    test('Eliminar todos los productos | "/:cId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idCart}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual('Products deleted.');
      }
    );
  });

  describe('Failed Carts Test', () =>
  {
  test('ID incorrecto | getOne | "/:cId"', async() =>
    {
      const idIncorrecto = 'soyunidincorrecto';

      const response = await request
            .get(`${urlApi}/${idIncorrecto}`)
            .set('Authorization', `Bearer ${token}`);

      const { _body, status } = response;
      const { message } = _body;

      expect(status).toStrictEqual(500);
      expect(_body.status).toStrictEqual('error');
      expect(message).toStrictEqual(`Cast to ObjectId failed for value "${idIncorrecto}" (type string) at path "_id" for model "carts"`);
    }
  );


    test('Product ID Incorrecto | "/:cId/products/:pId"', async() =>
      {
        const ProductidIncorrecto = 'soyunidincorrecto';

        const response = await request
              .put(`${urlApi}/${idCart}/products/${ProductidIncorrecto}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ quantity: 2 });

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(500);
        expect(_body.status).toStrictEqual('error');
        expect(message).toStrictEqual(`Cast to ObjectId failed for value "${ProductidIncorrecto}" (type string) at path "_id" for model "products"`);
      }
    );


    test('Pasar como valor de "quantity" 0 | "/:cId/products/:pId"', async() =>
      {
        const response = await request
              .put(`${urlApi}/${idCart}/products/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ quantity: 0 });

        const { _body, status } = response;
        const { message, error } = _body;
        const code = error[0].code;

        expect(status).toStrictEqual(400);
        expect(_body.status).toStrictEqual('error');
        expect(code).toStrictEqual('too_small');
      }
    );
  });
});
