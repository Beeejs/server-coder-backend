/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();

/* App Factory */
import AppFactory from './presentation/factories/appFactory.js';
/* Db Factory */
import DbFactory from './data/factories/DbFactory.js';
/* Logger */
import { Logger } from './utils/logger.js';
/* User Manager */
import UserManager from './domain/manager/userManager.js';


void(async() =>
{
   try
   {
      const db = DbFactory.create(process.env.DB);
      db.init(process.env.DB_URI);


      const app = AppFactory.create();
      app.init();
      app.build();
      app.listen();

      const manager = new UserManager();
      await manager.userInactive();
   }
   catch (error)
   {
      Logger.error(error || error.message);
   }
})();
