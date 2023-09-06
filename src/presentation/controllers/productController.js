import ProductManager from '../../domain/manager/productManager.js';


const list = async(req, res, next) =>
{
  try
  {
    const queryParams = req.query;
    const { limit, sort, page } = queryParams;

    const validFilters = ['category', 'enable', 'title'];

    const type = Object.entries(queryParams).reduce((filters, [key, value]) =>
      {
        if (validFilters.includes(key) && value !== '')
        {
          filters[key] = value;
        }
        return filters;
      },
    {});


    const manager = new ProductManager();
    const listOfProducts = await manager.list(limit, sort, type, page);

    return res.status(200).send({ status: 'success', payload: listOfProducts.docs.length ? listOfProducts.docs : 'No se encontraron productos con sus parametros de busqueda...', ...listOfProducts, docs: undefined });
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
    const pId = req.params.pId;

    const manager = new ProductManager();
    const getOneProduct = await manager.getOne(pId);

    return res.status(200).send({ status: 'success', getOneProduct });
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

    const manager = new ProductManager();
    const newProduct = await manager.create(data);

    res.status(201).send({ status: 'success', message: 'Product created.', newProduct });
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

    const pId = req.params.pId;

    const manager = new ProductManager();
    await manager.update(pId, data);

    res.status(200).send({ status: 'success', message:`Product with id ==> ${pId} Updated!` });
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
    const pId = req.params.pId;

    const manager = new ProductManager();
    await manager.deleteOne(pId);

    res.status(204).send({ status: 'success', message: `Product with id ==> ${pId} Deleted!` });
  }
  catch (error)
  {
    next(error);
  }
};


export { list, getOne, create, update, deleteOne };
