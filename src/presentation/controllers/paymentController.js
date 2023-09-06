import PaymentManager from '../../domain/manager/paymentManager.js';
/* Config */
import { FRONT } from '../../config/index.js';


const createOrder = async(req, res, next) =>
{
  try
  {
    const manager = new PaymentManager();
    const payment = await manager.createOrder(req.body);

    res.status(201).send({ status: 'success', payment });
  }
  catch (e)
  {
    next(e);
  }
};

const captureOrder = async(req, res, next) =>
{
  try
  {
    const { token } = req.query;

    const manager = new PaymentManager();
    await manager.captureOrder(token);

    res.redirect(`${FRONT}/payment/success?payment_id=${token}`);
  }
  catch (e)
  {
    next(e);
  }
};

const receiveWebhook = async(req, res, next) =>
{
  try
  {
    const payment = req.query;

    const manager = new PaymentManager();
    await manager.receiveWebhook(payment);

    res.status(204).send({ status: 'success', message: 'The purchase was completed successfully' });
  }
  catch (e)
  {
    next(e);
  }
};


export { createOrder, receiveWebhook, captureOrder };
