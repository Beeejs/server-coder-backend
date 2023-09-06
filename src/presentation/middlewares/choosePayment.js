import { defaultsPaymentServices } from '../../config/index.js';


const choosePayment = async(req, res, next) =>
{
  try
  {
    const { service } = req.body;

    let choose = '';

    defaultsPaymentServices.forEach(payment =>
    {
      if (payment[service] && payment[service].isActive === true) choose = payment[service];
    });

    if (!choose) return res.status(404).send({ status: 'error', message: 'Service not found.' });

    next();
  }
  catch (e)
  {
    next(e);
  }
};

export { choosePayment };
