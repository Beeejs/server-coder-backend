import dotenv from 'dotenv';
dotenv.config();

import { createContainer, asClass, Lifetime } from 'awilix';

import UserMongooseRepository from './data/repositories/mongoose/UserMongooseRepository.js';
import RoleMongooseRepository from './data/repositories/mongoose/RoleMongooseRepository.js';
import ProductMongooseRepository from './data/repositories/mongoose/ProductMongooseRepository.js';
import CartMongooseRepository from './data/repositories/mongoose/CartMongooseRepository.js';
import TicketMongooseRepository from './data/repositories/mongoose/TicketMongooseRepository.js';
import BlackListRepository from './data/repositories/mongoose/BlackListMongoose.js';

const container = createContainer();

  container.register('ProductRepository', asClass(ProductMongooseRepository), { lifetime: Lifetime.SINGLETON });
  container.register('CartRepository', asClass(CartMongooseRepository), { lifetime: Lifetime.SINGLETON });
  container.register('UserRepository', asClass(UserMongooseRepository), { lifetime: Lifetime.SINGLETON });
  container.register('RoleRepository', asClass(RoleMongooseRepository), { lifetime: Lifetime.SINGLETON });
  container.register('TicketRepository', asClass(TicketMongooseRepository), { lifetime: Lifetime.SINGLETON });
  container.register('BlackListRepository', asClass(BlackListRepository), { lifetime: Lifetime.SINGLETON });

export default container;
