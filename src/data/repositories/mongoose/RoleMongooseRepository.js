/* Model */
import { RoleModel } from '../../models/mongoose/roleSchema.js';
/* Entities */
import Role from '../../../domain/entities/role.js';

class RoleMongooseRepository
{
  async list(limit, page)
  {
    const rolesDocuments = await RoleModel.paginate(false, { limit: limit || 10, page });

    if (rolesDocuments.totalPages < page)
    {
      throw new Error(`The total pages is ${rolesDocuments.totalPages}`);
    }

    const roles = rolesDocuments.docs.map(doc => new Role(
      {
        id: doc._id,
        name: doc.name,
        permissions: doc.permissions
      }
    ));

    return {
      payload: roles,
      ...rolesDocuments
    };
  }

  async getOne(filter)
  {
    const roleDocument = await RoleModel.findOne(filter);

    if (!roleDocument) throw new Error(`The role => "${filter.name}", dont exist.`); // Manager? Por el establishedRole tiene que estar acá. Asi no lo hago en dos lados(session y user)

    return new Role(
      {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
      }
    );
  }

  async create(data)
  {
    const newRoleDoc = await RoleModel.create(data);

    return new Role(
      {
        id: newRoleDoc._id,
        name: newRoleDoc.name,
        permissions: newRoleDoc.permissions
      }
    );
  }

  async update(id, data)
  {
    const roleDocument = await RoleModel.findByIdAndUpdate({ _id:id }, data);

    return new Role(
      {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
      }
    );
  }

  async deleteOne(id)
  {
    const roleDocument = await RoleModel.findByIdAndUpdate({ _id:id }, { enable: false });

    return new Role(
      {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
      }
    );
  }
}

export default RoleMongooseRepository;
