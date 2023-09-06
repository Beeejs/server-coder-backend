import { Command } from 'commander';
/* Manager */
import UserManager from '../../domain/manager/userManager.js';
import CartManager from '../../domain/manager/cartManager.js';
/* Logger */
import { Logger } from '../../utils/logger.js';

const addUserCommand = new Command('addUser');

addUserCommand
  .version('0.0.1')
  .description('Add a new user')
  .option('-fn, --firstName <firstName>', 'User`s first name')
  .option('-ln, --lastName <lastName>', 'User`s last name')
  .option('-a, --age <age>', 'User`s age')
  .option('-e, --email <email>', 'User`s email')
  .option('-p, --password <password>', 'User`s password')
  .option('-r, --role <role>', 'User`s role')
  .action(async(env) =>
    {
      const payloadUser = {
        ...env,
        age: +env.age
      };

      const userManager = new UserManager();
      const user = await userManager.create(payloadUser);

      if (user)
      {
        const payloadCart = {
          user: user.id
        };

        const cartManager = new CartManager();
        const cart = await cartManager.create(payloadCart);
        Logger.info('User created successfully!');

        if (cart) Logger.info('Cart created successfully!');
      }
    }
  );

export default addUserCommand;
