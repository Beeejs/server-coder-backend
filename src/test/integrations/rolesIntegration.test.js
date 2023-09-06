/* Test Server */
import initTestServer from '../index.js';
/* Test Integration SetUp */
import TestIntSetUp from '../../utils/testIntSetUp.js';

describe('Start Roles Endpoints Test', () =>
{
  let request;
  let dataBase;

  const urlApi = '/api/roles';

  let idRole;
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


    test('Crear role | "/"', async() =>
      {
        const payload = {
          name: 'client',
          permissions: {
            roles: [],
            products: [
              'getList'
            ],
            users: [],
            sessions: [
              'login',
              'register',
              'current'
            ],
            carts: [
              'getOne',
              'cleanProducts',
              'addProduct'
            ]
          },
          enable: true
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { newRole } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(newRole.name).toStrictEqual(payload.name);

        idRole = newRole.id;
      }
    );


    test('Obtener role | "/:rId"', async() =>
      {
        const response = await request
              .get(`${urlApi}/${idRole}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { getOneRole } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(getOneRole.id).toStrictEqual(idRole);
      }
    );


    test('Modificar role | "/:rId"', async() =>
      {
        const payload = {
          permissions: {
            products: [
              'getList',
              'getOne'
            ]
          }
        };

        const response = await request
              .put(`${urlApi}/${idRole}`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Role with id ==> ${idRole} Updated!`);
      }
    );


    test('Eliminar role | "/:rId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idRole}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`Role with id ==> ${idRole} Deleted!`);
      }
    );
  });

  describe('Failed Roles Test', () =>
  {
    test('Falta de un dato | Create | "/"', async() =>
      {
        const payload = {
          // name: "client",
          permissions: {
            roles: [],
            products: [
              'getList'
            ],
            users: [],
            sessions: [
              'login',
              'register',
              'current'
            ],
            carts: [
              'getOne',
              'cleanProducts',
              'addProduct'
            ]
          },
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
        expect(field).toStrictEqual('name');
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
        expect(message).toStrictEqual(`Cast to ObjectId failed for value "${idIncorrecto}" (type string) at path "_id" for model "roles"`);
      }
    );
  });
});
