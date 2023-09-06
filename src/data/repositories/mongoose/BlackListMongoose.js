/* Model */
import { BlackListModel } from '../../models/mongoose/blacklistSchema.js';
/* Entities */
import BlackList from '../../../domain/entities/blackList.js';

class BlackListRepository
{
  async create(data)
  {
    const newBListDoc = await BlackListModel.create(data);

    return new BlackList({
      id: newBListDoc._id,
      token: newBListDoc.token
    });
  }

  async getOne(token)
  {
    const blackListDocument = await BlackListModel.findOne({ token });

    if (!blackListDocument) return null;

    return new BlackList({
      id: blackListDocument._id,
      token: blackListDocument.token
    });
  }
}

export default BlackListRepository;
