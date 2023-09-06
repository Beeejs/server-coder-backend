import RoleMongooseRepository from '../data/repositories/mongoose/RoleMongooseRepository.js';

const establishedRole = async(role) =>
{
  const roleRepository = new RoleMongooseRepository();
  const establishedRole = await roleRepository.getOne({ name: role || 'client' });

  return establishedRole.id;
};

export { establishedRole };
