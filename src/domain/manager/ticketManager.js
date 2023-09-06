import container from '../../container.js';
/* Zod */
import { idValidation } from '../validations/idValidation.js';
import { ticketCreateValidation } from '../validations/tickets/ticketValidation.js';

class TicketManager
{
  constructor()
  {
    this.ticketRepository = container.resolve('TicketRepository');
  }

  async list(limit, page)
  {
    return await this.ticketRepository.list(limit, page);
  }

  async getOne(field, value)
  {
    const ticket = await this.ticketRepository.getOne({ [field]: value });

    if (!ticket) throw new Error(`The ticket with ${field} => "${value}", dont exist.`);

    return ticket;
  }

  async getOneByPaymentId(pId)
  {
    const ticket = await this.ticketRepository.getOneByPaymentId({ ['information.payment_id'] : pId });

    if (!ticket) throw new Error(`The ticket with payment id => "${pId}", dont exist.`);

    const { information, purchase_datetime, code } = ticket;
    const { payer: { first_name, last_name }, mount, products, payment_id } = information;

    const payload = {
      payer: {
        first_name,
        last_name
      },
      payment_id,
      products,
      mount,
      purchase_datetime,
      code
    };

    return payload;
  }


  async create(data)
  {
    await ticketCreateValidation.parseAsync(data);
    return await this.ticketRepository.create(data);
  }

  async update(id, data)
  {
    await idValidation.parseAsync(id);
    return await this.ticketRepository.update(id, data);
  }

  async deleteOne(id)
  {
    await idValidation.parseAsync(id);

    return await this.ticketRepository.deleteOne(id);
  }
}

export default TicketManager;
