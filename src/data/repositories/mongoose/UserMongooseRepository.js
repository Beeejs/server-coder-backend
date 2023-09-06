/* Model */
import { UserModel } from '../../models/mongoose/userSchema.js';
/* Entities */
import User from '../../../domain/entities/user.js';
import Role from '../../../domain/entities/role.js';

class UserMongooseRepository
{
  async list(limit, sort, type, page)
  {
    const usersDocuments = await UserModel.paginate(type, { limit: limit || 10, page, sort });

    if (usersDocuments.totalPages < page)
    {
      throw new Error(`The total pages is ${usersDocuments.totalPages}`);
    }

    const users = usersDocuments.docs.map(doc => new User({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      age: doc.age,
      role: doc.role,
      last_connection: doc.last_connection,
      enable: doc.enable
    }));

    return {
      payload: users,
      ...usersDocuments
    };
  }

  async getOne(filter)
  {
    const userDocument = await UserModel.findOne(filter)
      .populate('role');

    if (!userDocument) return null;
    // if(!userDocument) throw new Error(`The user with ${`email:${filter.email}` ||`id:${filter._id}` } doesn't exist.`)
    // No sirve poner if aca ya que enb algunos casos tengo que manejar el que no exista, y esto es una traba

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      role: new Role(
        {
          id: userDocument.role._id,
          name: userDocument.role.name,
          permissions: userDocument.role.permissions
        }
      ),
      last_connection: userDocument.last_connection,
      enable: userDocument.enable
    });
  }

  async create(data)
  {
    const newUserDoc = await UserModel.create(data);

    return new User({
      id: newUserDoc._id,
      firstName: newUserDoc.firstName,
      lastName: newUserDoc.lastName,
      email: newUserDoc.email,
      age: newUserDoc.age,
      password: newUserDoc.password,
      role: newUserDoc.role,
      last_connection: newUserDoc.last_connection,
      enable: newUserDoc.enable
    });
  }

  async update(id, data)
  {
    const userDocument = await UserModel.findByIdAndUpdate({ _id:id }, data);

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      role: userDocument.role,
      last_connection: userDocument.last_connection,
      enable: userDocument.enable
    });
  }

  async deleteOne(id)
  {
    const userDocument = await UserModel.findByIdAndUpdate({ _id:id }, { enable: false });

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      role: userDocument.role,
      last_connection: userDocument.last_connection,
      enable: userDocument.enable
    });
  }

  async uploadFile(id, files)
  {
    const userDocument = await UserModel.findByIdAndUpdate({ _id:id }, {  document: files });

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      role: userDocument.role,
      last_connection: userDocument.last_connection,
      enable: userDocument.enable
    });
  }

  async userInactive(date)
  {
    return await UserModel.updateMany({ last_connection: { $lt: date } }, { $set: { enable: false } });
  }
}

export default UserMongooseRepository;
