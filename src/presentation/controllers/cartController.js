import CartManager from '../../domain/manager/cartManager.js';


const getOne = async(req, res, next) =>
{
  try
  {
    const cId = req.params.cId;

    const manager = new CartManager();
    const getOneCart = await manager.getOne(cId);

    return res.status(200).send({ status:'success', cartId:cId, products:getOneCart.products });
  }
  catch (error)
  {
    next(error);
  }
};

const getOneByUser = async(req, res, next) =>
{
  try
  {
    const uId = req.params.uId;

    const manager = new CartManager();
    const getOneCart = await manager.getOneByUser(uId);

    return res.status(200).send({ status:'success', Cart: getOneCart });
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
    const manager = new CartManager();
    const newCart = await manager.create(req.body);

    res.status(201).send({ status:'success', newCart });
  }
  catch (error)
  {
    next(error);
  }
};

const addProduct = async(req, res, next) =>
{
  try
  {
    const { cId, pId } = req.params;
    const { quantity } = req.body;

    const manager = new CartManager();
    await manager.addProduct(cId, pId, quantity);

    return res.status(200).send({ status:'success', message:'Added product to cart.' });
  }
  catch (error)
  {
    next(error);
  }
};

const cleanProducts = async(req, res, next) =>
{
  try
  {
    const cId = req.params.cId;

    const manager = new CartManager();
    await manager.cleanProducts(cId);

    return res.status(200).send({ status:'success', message:'Cart updated.' });
  }
  catch (error)
    {
    next(error);
  }
};

const deleteProduct = async(req, res, next) =>
{
  try
  {
    const { cId, pId } = req.params;

    const manager = new CartManager();
    await manager.deleteProduct(cId, pId);

    return res.status(200).send({ status:'success', message:'Product deleted.' });
  }
  catch (error)
  {
    next(error);
  }
};

const deleteAllProduct = async(req, res, next) =>
{
  try
  {
    const { cId, pId } = req.params;

    const manager = new CartManager();
    await manager.deleteAllProduct(cId, pId);

    return res.status(200).send({ status:'success', message:'All Product deleted.' });
  }
  catch (error)
  {
    next(error);
  }
};

const purchase = async(req, res, next) =>
{
  try
  {
    const cId = req.params.cId;

    const manager = new CartManager();
    await manager.purchase(cId);

    return res.status(200).send({ status:'success', message:'Purchase completed!' });
  }
  catch (error)
  {
    next(error);
  }
};


export { getOne, getOneByUser, create, addProduct, cleanProducts, deleteProduct, deleteAllProduct, purchase };
