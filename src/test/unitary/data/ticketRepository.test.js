/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

import DbFactory from '../../../data/factories/DbFactory.js';
import TicketMongooseRepository from '../../../data/repositories/mongoose/TicketMongooseRepository.js';
/* Faker */
import { faker } from '@faker-js/faker';

describe('Start RoleMongooseRepository Test', () =>
{
  let ticketRepository;
  let idTicket;
  const db = DbFactory.create();

  describe('Testing Tciket Mongoose Repository', () =>
  {
    beforeAll(async() =>
      {
        await db.init(process.env.DB_TESTING);
        ticketRepository = new TicketMongooseRepository();
      }
    );


    afterAll(async() =>
      {
        // await db.close();
        await db.drop();
      }
    );


    test('El repositorio debe ser una instacia de TicketMongooseRepository', () =>
      {
        expect(ticketRepository).toBeInstanceOf(TicketMongooseRepository);
      }
    );


    test('El metodo "list" debe devolver un arreglo de tickets', async() =>
      {
        const response = await ticketRepository.list();
        const { payload } = response;

        expect(Array.isArray(payload)).toStrictEqual(true);
      }
    );


    test('El metodo "create" debe crear un Ticket', async() =>
      {
        const data = {
          code: faker.number.int({ min: 500, max: 1000 }),
          purchase_datetime: faker.date.recent(),
          amount: faker.number.int({ min: 100, max: 1000 }),
          purchaser: faker.internet.email()
        };

        const response = await ticketRepository.create(data);
        const { id, purchaser } = response;

        expect(data.purchaser).toStrictEqual(purchaser);

        idTicket = id;
      }
    );


    test('El metodo "getOne" debe devolver un Ticket', async() =>
      {
        const filter = { _id: idTicket };

        const response = await ticketRepository.getOne(filter);
        const { id } = response;

        expect(idTicket).toStrictEqual(id);
      }
    );


    test('El metodo "update" debe modificar un Ticket', async() =>
      {
        const data = {
          purchase_datetime: faker.date.recent()
        };

        const response = await ticketRepository.update(idTicket, data);
        const { purchase_datetime } = response;

        expect(data.purchase_datetime).not.toBe(purchase_datetime);
      }
    );


    test('El metodo "deleteOne" debe modificar su propiedad "enable" a false', async() =>
      {
        const response = await ticketRepository.deleteOne(idTicket);
        const { id } = response;

        expect(id).toStrictEqual(idTicket);
      }
    );
  });
});
