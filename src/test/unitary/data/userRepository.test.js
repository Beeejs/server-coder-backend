/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

import DbFactory from '../../../data/factories/DbFactory.js';
import UserMongooseRepository from '../../../data/repositories/mongoose/UserMongooseRepository.js';
import RoleMongooseRepository from '../../../data/repositories/mongoose/RoleMongooseRepository.js';
/* Faker */
import { faker } from '@faker-js/faker';


describe('Start UserMongooseRepository Test', () =>
{
  let userRepository;
  let roleRepository;
  let idRole;
  let userEmail;
  let idUser;

  const db = DbFactory.create();

  describe('Testing User Mongoose Repository', () =>
  {
    beforeAll(async() =>
      {
        await db.init(process.env.DB_TESTING);
        userRepository = new UserMongooseRepository();
        roleRepository = new RoleMongooseRepository();
      }
    );

    afterAll(async() =>
      {
        // await db.close();
        await db.drop();
      }
    );

    test('El repositorio debe ser una instacia de UserMongooseRepository', () =>
      {
        expect(userRepository).toBeInstanceOf(UserMongooseRepository);
      }
    );


    test('El metodo "list" debe devolver un arreglo de users', async() =>
      {
        const response = await userRepository.list();
        const { payload } = response;

        expect(Array.isArray(payload)).toStrictEqual(true);
      }
    );

    describe('Crear un usuario | Crear roles', () =>
    {
      test('El metodo "create" debe crear un Role', async() =>
        {
          const roleClient = {
            name: 'client',
            permissions: {
              roles: [],
              products: [
                'getList',
                'getOne'
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

          const response = await roleRepository.create(roleClient);
          const { id, name } = response;

          expect(roleClient.name).toStrictEqual(name);
          idRole = id;
        }
      );

      test('El metodo "create" debe crear un User', async() =>
        {
          const user = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            age: faker.number.int({ min: 10, max: 95 }),
            email: faker.internet.email(),
            password: faker.internet.password(),
            enable: true,
            role: idRole
          };

          const response = await userRepository.create(user);
          const { email } = response;

          expect(user.email).toStrictEqual(email);
          userEmail = email;
        }
      );
    });

    test('El metodo "getOne" debe devolver un User', async() =>
      {
        const filter = { email: userEmail };

        const response = await userRepository.getOne(filter);
        const { id, email } = response;

        expect(userEmail).toStrictEqual(email);

        idUser = id;
      }
    );


    test('El metodo "update" debe modificar un User', async() =>
      {
        const user = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email()
        };

        const response = await userRepository.update(idUser, user);
        const { email } = response;
        // response.email seria el valor anterior
        expect(user.email).not.toBe(email);
      }
    );

    test('El metodo "deleteOne" debe modificar su propiedad "enable" a false', async() =>
      {
        const response = await userRepository.deleteOne(idUser);
        const { id } = response;

        expect(id).toStrictEqual(idUser);
      }
    );
  });
});
