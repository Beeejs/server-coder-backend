/* Repositories */
import BlackListRepository from '../../data/repositories/mongoose/BlackListMongoose.js';
/* Utils */
import { verifyAccessToken } from '../../utils/tokenUtils.js';

const verifyToken = async(req, res, next) =>
{
  try
  {
    let token = req.headers.authorization;
    if (!token) return res.status(403).send({ status: 'error', message: 'No token provided.' });

    token = token.split(' ')[1];

    const blackListRepository = new BlackListRepository();
    const isToken = await blackListRepository.getOne(token);

    if (isToken) throw new Error('This token has already expired.');

    const decoded = await verifyAccessToken(token);
    req.user = decoded.user;

    if (!decoded.user.email) return res.status(401).send({ status: 'error', message: 'The user is invalid.' });

    next();
  }
  catch (error)
  {
    next(error);
  }
};

export { verifyToken };
