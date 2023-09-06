import RoleManager from '../../domain/manager/roleManager.js';


const list = async(req, res, next) =>
{
  try
  {
    const { limit, page } = req.query;

    const manager = new RoleManager();
    const listOfRoles = await manager.list(limit, page);

    return res.status(200).send({ status: 'success', payload: listOfRoles.docs, ...listOfRoles, docs: undefined });
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
    const rId = req.params.rId;

    const manager = new RoleManager();
    const getOneRole = await manager.getOne('_id', rId);

    return res.status(200).send({ status: 'success', getOneRole });
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

    const manager = new RoleManager();
    const newRole = await manager.create(data);

    res.status(201).send({ status: 'success', message: 'Role created.', newRole });
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

    const rId = req.params.rId;

    const manager = new RoleManager();
    await manager.update(rId, data);

    res.status(200).send({ status: 'success', message:`Role with id ==> ${rId} Updated!` });
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
    const rId = req.params.rId;

    const manager = new RoleManager();
    await manager.deleteOne(rId);

    res.status(204).send({ status: 'success', message: `Role with id ==> ${rId} Deleted!` });
  }
  catch (error)
  {
    next(error);
  }
};


export { list, getOne, create, update, deleteOne };
