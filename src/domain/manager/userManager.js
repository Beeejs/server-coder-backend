import container from '../../container.js';
/* Utils */
import { establishedRole } from '../../utils/establishedRole.js';
/* Bcrypt */
import { createHash } from '../../utils/handleBcrypt.js';
/* Zod */
import { userRegisterValidation } from '../validations/session/sessionValidation.js';
import { userUpdateValidation } from '../validations/user/userValidation.js';
import { idValidation } from '../validations/idValidation.js';
/* Logger */
import { Logger } from '../../utils/logger.js';
/* Cron */
import cron from 'node-cron';


class UserManager
{
  constructor()
  {
    this.userRepository = container.resolve('UserRepository');
  }

  async list(limit, sort, type, page)
  {
    sort = sort ? sort === 'asc' ? { age:1 } : (sort === 'desc' ? { age:-1 } : 'invalid') : null;

    if (sort === 'invalid')
    {
      throw new Error('The sort query is invalid.');
    }

    return await this.userRepository.list(limit, sort, type, page);
  }

  async getOne(field, value)
  {
    const user = await this.userRepository.getOne({ [field]: value });
    if (!user) throw new Error(`The user with ${field}:${value} doesn't exist.`);

    return user;
  }

  async create(data)
  {
    await userRegisterValidation.parseAsync(data);

    const idRole = await establishedRole(data.role);

    data.role = idRole;

    const payload = {
      ...data,
      password: await createHash(data.password, 10)
    };

    const user = await this.userRepository.create(payload);

    return { ...user, password: undefined };
  }

  async update(id, data)
  {
    await idValidation.parseAsync(id);
    await userUpdateValidation.parseAsync(data);

    return await this.userRepository.update(id, data);
  }

  async deleteOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.userRepository.deleteOne(id);
  }

  async userInactive()
  {
    cron.schedule('0 0 * * *', async() =>
      {
        const currentDate = new Date();

        const twoDaysAgo = new Date();
        twoDaysAgo .setDate(currentDate.getDate() - 30); // 1 mes

        const data = await this.userRepository.userInactive(twoDaysAgo);

        Logger.info(`${data.modifiedCount} users removed.`);
      }
    );
  }
}

export default UserManager;
