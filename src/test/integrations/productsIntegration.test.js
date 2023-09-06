/* Test Server */
import initTestServer from '../index.js';
/* Test Integration SetUp */
import TestIntSetUp from '../../utils/testIntSetUp.js';

describe('Start Products Endpoints Test', () =>
{
  let request;
  let dataBase;

  const urlApi = '/api/products';

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

  describe('Success Products Test', () =>
  {
    beforeAll(async() =>
      {
          const testSetUp = new TestIntSetUp();

          await testSetUp.createRole('admin');
          await testSetUp.userSingUp(request);
          token = await testSetUp.userLogin();
      }
    );


    test('Lista de productos | "/"', async() =>
      {
        const response = await request
              .get(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { payload } = _body;

        expect(status).toStrictEqual(200);
        expect(Array.isArray(payload)).toStrictEqual(true);
      }
    );


    test('Crear producto | "/"', async() =>
      {
        const payload = {
          title: 'ProductTest',
          description: 'ProductTest-description',
          price: 100,
          code: 123,
          stock: 10,
          category: 'category',
          enable: true
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { newProduct } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(newProduct.title).toStrictEqual(payload.title);

        idProduct = newProduct.id;
      }
    );


    test('Obtener producto | "/:pId"', async() =>
      {
        const response = await request
              .get(`${urlApi}/${idProduct}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { getOneProduct } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(getOneProduct.id).toStrictEqual(idProduct);
      }
    );


    test('Modificar producto | "/:pId"', async() =>
      {
        const payload = {
          title: 'ProductTest-mod',
          description: 'ProductTest-description-mod'
        };

        const response = await request
              .put(`${urlApi}/${idProduct}`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Product with id ==> ${idProduct} Updated!`);
      }
    );


    test('Eliminar producto | "/:pId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idProduct}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Product with id ==> ${idProduct} Deleted!`);
      }
    );
  });

  describe('Failed Products Test', () =>
  {
    test('Falta de un dato | Create | "/"', async() =>
      {
        const payload = {
          title: 'ProductTest',
          description: 'ProductTest-description',
          // price: 100
          code: 123,
          stock: 10,
          category: 'category',
          enable: true
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { error } = _body;

        const field = error[0].path[0];

        expect(status).toStrictEqual(400);
        expect(field).toStrictEqual('price');
      }
    );


    test('Falta de todos los datos | Create | "/"', async() =>
      {
        const payload = {};

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { error } = _body;

        expect(status).toStrictEqual(400);
        expect(error.length).toBe(6);
      }
    );


    test('ID incorrecto | getOne | "/:pId"', async() =>
      {
        const idIncorrecto = 'soyunidincorrecto';

        const response = await request
              .get(`${urlApi}/${idIncorrecto}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(500); // no tendria que ser 500
        expect(_body.status).toStrictEqual('error');
        expect(message).toStrictEqual(`Cast to ObjectId failed for value "${idIncorrecto}" (type string) at path "_id" for model "products"`);
      }
    );
  });
});
