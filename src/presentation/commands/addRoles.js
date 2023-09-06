import { Command } from 'commander';
/* Manager */
import RoleManager from '../../domain/manager/roleManager.js';
/* Logger */
import { Logger } from '../../utils/logger.js';
/* Config */
import { defaultsRole } from '../../config/index.js';

const addRolesCommand = new Command('addRoles');

addRolesCommand
  .version('0.0.1')
  .description('Add a Roles')
  .action(async() =>
    {
      const manager = new RoleManager();

      const roleClient = await manager.create(defaultsRole[0]);
      const roleAdmin = await manager.create(defaultsRole[1]);

      if (roleClient && roleAdmin) Logger.info('Roles created successfully!');
    }
  );

export default addRolesCommand;
