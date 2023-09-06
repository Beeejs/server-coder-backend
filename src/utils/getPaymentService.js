/* Services */
import { MercadoPagoService, PayPalService } from '../presentation/services/paymentService.js';
/* Zod */
import { paypalOrderValidation } from '../domain/validations/payment/paypal/orderValidation.js';
import { mpOrderValidation } from '../domain/validations/payment/mercadopago/orderValidation.js';


const getPaymentService = async(serviceName, data) =>
{
  switch (serviceName)
  {
    case 'paypal':
      await paypalOrderValidation.parseAsync(data);
      return new PayPalService();

    case 'mercadopago':
      await mpOrderValidation.parseAsync(data);
      return new MercadoPagoService();

    default:
      throw new Error('Invalid payment service.');
  }
};

export { getPaymentService };
