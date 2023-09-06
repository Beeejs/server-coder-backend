import UserManager from '../../domain/manager/userManager.js';


const list = async(req, res, next) =>
{
  try
  {
    const { limit, sort, page } = req.query;
    const type = req.query.firstName ? { firstName: req.query.firstName }
    : req.query.email ? { email: req.query.email }
    : req.query.enable ? { enable: req.query.enable }
    : null;

    const manager = new UserManager();
    const listOfUsers = await manager.list(limit, sort, type, page);

    return res.status(200).send({ status:'success', payload:listOfUsers.docs, ...listOfUsers, docs: undefined });
  }
  catch (error)
  {
    next(error);
  }
};


const getOne = async(req, res, next) =>
{
  try
  {
    const uId = req.params.uId;

    const manager = new UserManager();
    const getOneUser = await manager.getOne('_id', uId);

    return res.status(200).send({ status: 'success', getOneUser });
  }
  catch (error)
  {
    next(error);
  }
};


const create = async(req, res, next) =>
{
  try
  {
    const data = req.body;

    const manager = new UserManager();
    const newUser = await manager.create(data);

    res.status(201).send({ status: 'success', message: 'User created.', newUser });
  }
  catch (error)
{
    next(error);
  }
};


const update = async(req, res, next) =>
{
  try
  {
    const data = req.body;
    const uId = req.params.uId;

    const manager = new UserManager();
    await manager.update(uId, data);

    res.status(200).send({ status: 'success', message: `User with id ==> ${uId} Updated!` });
  }
  catch (error)
  {
    next(error);
  }
};


const deleteOne = async(req, res, next) =>
{
  try
  {
    const uId = req.params.uId;

    const manager = new UserManager();
    await manager.deleteOne(uId);

    res.status(204).send({ status: 'success', message: `User with id ==> ${uId} Deleted!` });
  }
  catch (error)
  {
    next(error);
  }
};


export { list, getOne, create, update, deleteOne };
