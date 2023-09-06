/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

import DbFactory from '../../../data/factories/DbFactory.js';
import RoleMongooseRepository from '../../../data/repositories/mongoose/RoleMongooseRepository.js';

describe('Start RoleMongooseRepository Test', () =>
{
  let roleRepository;
  let idRole;
  const db = DbFactory.create();

  describe('Testing Role Mongoose Repository', () =>
  {
    beforeAll(async() =>
      {
        await db.init(process.env.DB_TESTING);
        roleRepository = new RoleMongooseRepository();
      }
    );


    afterAll(async() =>
      {
        // await db.close();
        await db.drop();
      }
    );


    test('El repositorio debe ser una instacia de RoleMongooseRepository', () =>
      {
        expect(roleRepository).toBeInstanceOf(RoleMongooseRepository);
      }
    );


    test('El metodo "list" debe devolver un arreglo de roles', async() =>
      {
        const response = await roleRepository.list();
        const { payload } = response;

        expect(Array.isArray(payload)).toStrictEqual(true);
      }
    );


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


    test('El metodo "getOne" debe devolver un Role', async() =>
      {
        const filter = { _id: idRole };

        const response = await roleRepository.getOne(filter);
        const { id } = response;

        expect(idRole).toStrictEqual(id);
      }
    );


    test('El metodo "update" debe modificar un Role', async() =>
      {
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

        const response = await roleRepository.update(idRole, roleAdmin);
        const { name } = response;

        expect(roleAdmin.name).not.toBe(name);
      }
    );


    test('El metodo "deleteOne" debe modificar su propiedad "enable" a false', async() =>
      {
        const response = await roleRepository.deleteOne(idRole);
        const { id } = response;

        expect(id).toStrictEqual(idRole);
      }
    );
  });
});
