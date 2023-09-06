/* Test Server */
import initTestServer from '../index.js';
/* Repositories */
import RoleMongooseRepository from '../../data/repositories/mongoose/RoleMongooseRepository.js';
import UserMongooseRepository from '../../data/repositories/mongoose/UserMongooseRepository.js';

describe('Start Session Endpoints Test', () =>
{
  let request;
  let dataBase;

  let roleRepository;
  let userRepository;

  const urlApi = '/api/sessions';
  let token = '';
  let idRole;

  beforeAll(async() =>
    {
      const { requester, db } = await initTestServer();
      dataBase = db;
      request = requester;

      roleRepository = new RoleMongooseRepository();
      userRepository = new UserMongooseRepository();
    }
  );

  afterAll(async() =>
    {
      // await dataBase.close();
      await dataBase.drop();
    }
  );

  describe('Success Session Test', () =>
  {
    beforeAll(async() =>
      {
        // Aqui no utilizo el initSetUp porque no se necesita el token desde el primer momento
        const roleAdmin = {
          name: 'admin',
          permissions: {
            roles: [
              'create',
              'getList',
              'getOne',
              'update',
              'delete'
            ],
            products: [
              'create',
              'getList',
              'getOne',
              'update',
              'delete'
            ],
            users: [
              'create',
              'getList',
              'getOne',
              'update',
              'delete'
            ],
            sessions: [
              'login',
              'register',
              'current'
            ],
            carts: [
              'create',
              'getOne',
              'cleanProducts',
              'deleteProduct',
              'addProduct',
              'deleteAllProducts'
            ],
            tickets: [
              'create',
              'getList',
              'getOne',
              'update',
              'delete'
            ]
          },
          enable: true
        };

        const response = await roleRepository.create(roleAdmin);
        const { id, name } = response;

        expect(name).toStrictEqual(roleAdmin.name);

        idRole = id;
      }
    );

    test('Resgistro de usuario | "/signup"', async() =>
      {
          const payload = {
            firstName: 'UserTest',
            lastName: 'Test',
            age: 19,
            email: 'usertest@node.com',
            password: 'hola123456',
            role: 'admin'
          };

          const response = await request
                .post(`${urlApi}/signup`)
                .set('Content-Type', 'application/json')
                .send(payload);

          const { _body, status } = response;

          expect(status).toStrictEqual(201);
          expect(_body.status).toStrictEqual('success');
          expect(_body.user.email).toStrictEqual(payload.email);
      }
    );


    test('Logueo de usuario | "/login"', async() =>
      {
        const payload = {
          email: 'usertest@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/login`)
              .set('Content-Type', 'application/json')
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');

        token = _body.token;
      }
    );


    test('Usuario activo | "/current"', async() =>
      {
        const payload = {
          email: 'usertest@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/current`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

              const { _body, status } = response;

        expect(status).toStrictEqual(200);
        expect(_body.status).toStrictEqual('success');
        expect(_body.user.email).toStrictEqual(payload.email);
      }
    );
  });

  describe('Failed Session Test', () =>
  {
    beforeAll(async() =>
      {
        const user = {
          firstName: 'UserExist',
          lastName: 'Test',
          age: 19,
          email: 'usertestYaExisto@node.com',
          password: 'hola123456',
          role: idRole
        };

        const response = await userRepository.create(user);
        const { email } = response;

        expect(user.email).toStrictEqual(email);
      }
    );


    test('Resgistro de usuario | "/signup"', async() =>
      {
        const payload = {
          firstName: 'UserExist',
          lastName: 'Test',
          age: 19,
          email: 'usertestYaExisto@node.com',
          password: 'hola123456',
          role: 'admin'
        };

        const response = await request
              .post(`${urlApi}/signup`)
              .set('Content-Type', 'application/json')
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(500);
        expect(_body.message).toStrictEqual('The user with email => "usertestYaExisto@node.com", already exist.');
      }
    );


    test('El usuario no existe | "/login"', async() =>
      {
        const payload = {
          email: 'usertestNoExisto@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/login`)
              .set('Content-Type', 'application/json')
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(500);
        expect(_body.message).toStrictEqual('The user with email:usertestNoExisto@node.com doesn\'t exist.');
      }
    );


    test('El usuario no existe | "/current"', async() =>
      {
        const payload = {
          email: 'usertestNoExisto@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/current`)
              .set('Authorization', `Bearer ${token}`)
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(500);
        expect(_body.message).toStrictEqual('The user with email:usertestNoExisto@node.com doesn\'t exist.');
      }
    );


    test('Sin envio de Token | "/current"', async() =>
      {
        const payload = {
          email: 'usertest@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/current`)
              .set('Authorization', '')
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(403);
        expect(_body.message).toStrictEqual('No token provided.');
      }
    );


    test('Token invalido | "/current"', async() =>
      {
        const payload = {
          email: 'usertest@node.com',
          password: 'hola123456'
        };

        const response = await request
              .post(`${urlApi}/current`)
              .set('Authorization', 'estetokenesinvalido')
              .send(payload);

        const { _body, status } = response;

        expect(status).toStrictEqual(500);
        expect(_body.message).toStrictEqual('jwt must be provided');
      }
    );
  });
});
