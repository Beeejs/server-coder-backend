/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

/* App Factory */
import AppFactory from '../presentation/factories/appFactory.js';
/* Db Factory */
import DbFactory from '../data/factories/DbFactory.js';
/* Supertest */
import request from 'supertest';


const initTestServer = async() =>
{
  const db = DbFactory.create();
  db.init(process.env.DB_TESTING);

  const app = AppFactory.create();

  app.init();
  app.build();

  const requester = request(app.callback());

  return { db, requester };
};

export default initTestServer;
