/* Test Server */
import initTestServer from '../index.js';
/* Test Integration SetUp */
import TestIntSetUp from '../../utils/testIntSetUp.js';

describe('Start Roles Endpoints Test', () =>
{
  let request;
  let dataBase;

  const urlApi = '/api/tickets';

  let idTicket;
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

  describe('Success Roles Test', () =>
  {
    beforeAll(async() =>
      {
        const testSetUp = new TestIntSetUp();

        await testSetUp.createRole('admin');
        await testSetUp.userSingUp(request);
        token = await testSetUp.userLogin();
      }
    );


    test('Lista de roles | "/"', async() =>
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


    test('Crear tciket | "/"', async() =>
      {
        const payload = {
          code: '123456',
          purchase_datetime: Date.now(),
          amount: 1200,
          purchaser: 'test@example.com',
          enable: true
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { newTicket } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(newTicket.code).toStrictEqual(payload.code);

        idTicket = newTicket.id;
      }
    );


    test('Obtener ticket | "/:tId"', async() =>
      {
        const response = await request
              .get(`${urlApi}/${idTicket}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { getOneTicket } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(getOneTicket.id).toStrictEqual(idTicket);
      }
    );


    test('Modificar ticket | "/:tId"', async() =>
      {
        const payload = {
          amount: 1500,
          purchaser: 'test@gmail.com'
        };

        const response = await request
              .put(`${urlApi}/${idTicket}`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Ticket with id ==> ${idTicket} Updated!`);
      }
    );


    test('Eliminar ticket | "/:tId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idTicket}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Ticket with id ==> ${idTicket} Deleted!`);
      }
    );
  });

  describe('Failed Tickets Test', () =>
  {
    test('Falta de un dato | Create | "/"', async() =>
      {
        const payload = {
          code: '123456',
          purchase_datetime: Date.now(),
          amount: 1200,
          // purchaser: 'test@example.com',
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
        expect(field).toStrictEqual('purchaser');
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
        expect(error.length).toBe(4);
      }
    );


    test('ID incorrecto | getOne | "/:cId"', async() =>
      {
        const idIncorrecto = 'soyunidincorrecto';

        const response = await request
              .get(`${urlApi}/${idIncorrecto}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(500); // no tendria que ser 500
        expect(_body.status).toStrictEqual('error');
        expect(message).toStrictEqual(`Cast to ObjectId failed for value "${idIncorrecto}" (type string) at path "_id" for model "tickets"`);
      }
    );
  });
});
