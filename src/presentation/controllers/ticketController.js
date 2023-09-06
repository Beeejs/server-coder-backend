import TicketManager from '../../domain/manager/ticketManager.js';


const list = async(req, res, next) =>
{
  try
{
    const { limit, page } = req.query;

    const manager = new TicketManager();
    const listOfTickets = await manager.list(limit, page);

    return res.status(200).send({ status: 'success', payload: listOfTickets.docs, ...listOfTickets, docs: undefined });
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
    const tId = req.params.tId;

    const manager = new TicketManager();
    const getOneTicket = await manager.getOne('_id', tId);

    return res.status(200).send({ status: 'success', getOneTicket });
  }
  catch (error)
{
    next(error);
  }
};


const getOneByPaymentId = async(req, res, next) =>
{
  try
  {
    const pId = req.params.pId;

    const manager = new TicketManager();
    const getOneTicket = await manager.getOneByPaymentId(pId);

    return res.status(200).send({ status: 'success', getOneTicket });
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

    const manager = new TicketManager();
    const newTicket = await manager.create(data);

    res.status(200).send({ status: 'success', message: 'Ticket created.', newTicket });
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

    const tId = req.params.tId;

    const manager = new TicketManager();
    await manager.update(tId, data);

    res.status(200).send({ status: 'success', message:`Ticket with id ==> ${tId} Updated!` });
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
    const tId = req.params.tId;

    const manager = new TicketManager();
    await manager.deleteOne(tId);

    res.status(204).send({ status: 'success', message: `Ticket with id ==> ${tId} Deleted!` });
  }
  catch (error)
  {
    next(error);
  }
};


export { list, getOne, getOneByPaymentId, create, update, deleteOne };
