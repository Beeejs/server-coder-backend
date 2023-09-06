import container from '../../container.js';
/* Zod */
import { idValidation } from '../validations/idValidation.js';
import { roleCreateValidation, roleUpdateValidation } from '../validations/role/roleValidation.js';

class RoleManager
{
  constructor()
  {
    this.roleRepository = container.resolve('RoleRepository');
  }

  async list(limit, page)
  {
    return await this.roleRepository.list(limit, page);
  }

  async getOne(field, value)
  {
    return await this.roleRepository.getOne({ [field]: value });
  }

  async create(data)
  {
    await roleCreateValidation.parseAsync(data);

    return await this.roleRepository.create(data);
  }

  async update(id, data)
  {
    await roleUpdateValidation.parseAsync(data);
    await idValidation.parseAsync(id);

    return await this.roleRepository.update(id, data);
  }

  async deleteOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.roleRepository.deleteOne(id);
  }
}

export default RoleManager;
