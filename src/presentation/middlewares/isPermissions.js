/* eslint no-eval: 0 */
import UserManager from '../../domain/manager/userManager.js';

const isPermissions = (field, permission) =>
{
  return async(req, res, next) =>
  {
    const userTravel = req.user;

    const mangaer = new UserManager();
    const user = await mangaer.getOne('_id', userTravel.id);

    if (!user) throw new Error('The user does not exist.');

    const permissions = eval(`user.role?.permissions.${field}`).find(p => p === permission);
    if (!permissions) return res.status(401).send({ status: 'error', message: 'Not authorization.' });

    next();
  };
};

export { isPermissions };
