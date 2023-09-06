/* Test Server */
import initTestServer from '../index.js';
/* Test Integration SetUp */
import TestIntSetUp from '../../utils/testIntSetUp.js';

describe('Start Users Endpoints Test', () =>
{
  let request;
  let dataBase;

  const urlApi = '/api/users';

  let idUser;
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

  describe('Success Users Test', () =>
  {
    beforeAll(async() =>
      {
        const testSetUp = new TestIntSetUp();

        await testSetUp.createRole('admin');
        await testSetUp.userSingUp(request);
        token = await testSetUp.userLogin();
      }
    );


    test('Lista de usuarios | "/"', async() =>
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


    test('Crear usuario | "/"', async() =>
      {
        const payload = {
          firstName: 'UserTest',
          lastName: 'UserTest',
          age: 18,
          email: 'UxM1G@example.com',
          password: 'User123456',
          enable: true,
          role: 'admin'
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { newUser } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(newUser.email).toStrictEqual(payload.email);

        idUser = newUser.id;
      }
    );


    test('Obtener usuario | "/:uId"', async() =>
      {
        const response = await request
              .get(`${urlApi}/${idUser}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { getOneUser } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(getOneUser.id).toStrictEqual(idUser);
      }
    );


    test('Modificar usuario | "/:uId"', async() =>
      {
        const payload = {
          firstName: 'newName',
          age: 20
        };

        const response = await request
              .put(`${urlApi}/${idUser}`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`User with id ==> ${idUser} Updated!`);
      }
    );


    test('Eliminar usuario | "/:uId"', async() =>
      {
        const response = await request
              .delete(`${urlApi}/${idUser}`)
              .set('Authorization', `Bearer ${token}`);

        const { _body, status } = response;
        const { message } = _body;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(message).toStrictEqual(`User with id ==> ${idUser} Deleted!`);
      }
    );
  });

  describe('Failed Users Test', () =>
  {
    test('Falta de un dato | Create | "/"', async() =>
      {
        const payload = {
          firstName: 'UserTest',
          lastName: 'UserTest',
          age: 18,
          // email: 'UxM1G@example.com',
          password: 'User123456',
          enable: true,
          role: 'admin'
        };

        const response = await request
              .post(`${urlApi}/`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;
        const { error } = _body;

        const field = error[0].path[0];

        expect(status).toStrictEqual(400);
        expect(field).toStrictEqual('email');
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

        expect(status).toStrictEqual(500);
        expect(_body.status).toStrictEqual('error');
        expect(message).toStrictEqual(`Cast to ObjectId failed for value "${idIncorrecto}" (type string) at path "_id" for model "users"`);
      }
    );
  });
});
