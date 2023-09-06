/* Dotenv */
import dotenv from 'dotenv';
dotenv.config();
/* Commander */
import { program } from 'commander';
import { exit } from 'shelljs';
/* Commands */
import addUserCommand from './presentation/commands/addUser.js';
import addRolesCommand from './presentation/commands/addRoles.js';

/* Db Factory */
import DbFactory from './data/factories/DbFactory.js';
/* Logger */
import { Logger } from './utils/logger.js';


void(async() =>
{
  try
  {
    const db = DbFactory.create(process.env.DB);
    db.init(process.env.DB_URI);

    program.addCommand(addUserCommand).addCommand(addRolesCommand);

    await program.parseAsync(process.argv);

    exit();
  }
  catch (error)
  {
    Logger.error(error || error.message);
    exit();
  }
})();
