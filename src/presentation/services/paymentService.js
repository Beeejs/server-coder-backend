/* Services */
import mercadopago from 'mercadopago';
import EmailService from './emailService.js';
/* Config */
import { FRONT, HOST } from '../../config/index.js';
/* axios */
import axios from 'axios';
/* Uuidv4 */
import { v4 as uuidv4 } from 'uuid';


class MercadoPagoService
{
  constructor()
  {
    this.config_mercadopago = mercadopago.configure(
      {
        access_token: process.env.SECRET_TOKEN_MP
      }
    );
    this.emailService = new EmailService();
  }

  async createOrder(order, payer)
  {
    const { body: { init_point } } = await mercadopago.preferences.create(
      {
        items: order,
        payer:{
          ...payer
        },
        notification_url: `${HOST}/api/payments/webhook`, // Espera a un servido https, ya que es segura, por eso ngrok.
        auto_return: 'approved',
        back_urls: { // Aca vamos a poner las urls del front para renderizar en cada caso segun el estado.
          success: `${FRONT}/payment/success`,
          failure: `${FRONT}/payment/failure`,
          pending: `${FRONT}/payment/pending`
        },
        payment_methods: {
          excluded_payment_methods: [
            {
              id: 'amex'
            }
          ],
          installments: 3
        },
        statement_descriptor: 'Ecommerce CoderHouse'
      }
    );

    return init_point;
  }


  async receiveWebhook(payment)
  {
    const { response } = await mercadopago.payment.findById(payment['data.id']);
    const { transaction_amount, card, status, installments, payment_method_id, payer, additional_info, id } = response;

    const payload = {
      payer:{
        ...additional_info.payer,
        email: payer.email,
        identification: payer.identification
      },
      payment_id: id.toString(),
      products: additional_info.items,
      mount: transaction_amount,
      method: payment_method_id,
      card: card.last_four_digits ? `**** **** **** ${card.last_four_digits}` : null,
      state_transaction: status,
      installments
    };

    const ticket = {
      code: uuidv4(),
      purchase_datetime: Date.now(),
      information: payload
    };

    if (status === 'approved') return ticket;
  }
}


class PayPalService
{
  constructor()
  {
    this.auth = {
      auth: {
        username: process.env.PAYPAL_API_CLIENT,
        password: process.env.PAYPAL_API_SECRET
      }
    };
  }

  async createOrder(data)
  {
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          ...data
        }
      ],
      application_context: {
        brand_name: 'Ecommerce Coderhouse',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${HOST}/api/payments/capture-order`,
        cancel_url: `${FRONT}/payment/failure`
      }
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const { data: { access_token } } = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, this.auth);

    const { data: { links } } = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    return links[1].href;
  }

  async captureOrder(token)
  {
    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, this.auth);

    const { data } = await axios(response.data.links[0].href, this.auth);

    const { status, payer, purchase_units, id } = data;

    const payload = {
      payer: {
        address:{
          street_name: purchase_units[0].shipping.address.address_line_1,
          zip_code: purchase_units[0].shipping.address.postal_code
        },
        first_name: payer.name.given_name,
        last_name: payer.name.surname,
        email: payer.email_address
      },
      payment_id: id,
      products: purchase_units[0].items,
      mount: purchase_units[0].amount.value
    };

    const ticket = {
      code: uuidv4(),
      purchase_datetime: Date.now(),
      information: payload
    };

    if (status === 'COMPLETED') return ticket;
  }
}


export { MercadoPagoService, PayPalService };
