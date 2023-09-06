import container from '../../container.js';
/* Service */
import { MercadoPagoService, PayPalService } from '../../presentation/services/paymentService.js';
/* Utils */
import { getPaymentService } from '../../utils/getPaymentService.js';


class PaymentManager
{
  constructor()
  {
    this.paypal = new PayPalService();
    this.mercadoPago = new MercadoPagoService();
    this.ticketRepository = container.resolve('TicketRepository');
  }

  async createOrder(data)
  {
    const { service, order, payer } = data;

    const paymentService = await getPaymentService(service, data);

    const link = await paymentService.createOrder(order, payer);

    return { url_payment: link };
  }

  async captureOrder(token)
  {
    const ticket = await this.paypal.captureOrder(token);

    await this.ticketRepository.create(ticket);
  }

  async receiveWebhook(payment)
  {
    if (payment.type !== 'payment') return null;

    const ticket = await this.mercadoPago.receiveWebhook(payment);

    await this.ticketRepository.create(ticket);
  }
}

export default PaymentManager;
