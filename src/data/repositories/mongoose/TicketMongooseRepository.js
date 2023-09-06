/* Model */
import { TicketModel } from '../../models/mongoose/ticketSchema.js';
/* Entities */
import Ticket from '../../../domain/entities/ticket.js';

class TicketMongooseRepository
{
  async list(limit, page)
  {
    const ticketsDocuments = await TicketModel.paginate(false, { limit: limit || 10, page });

    if (ticketsDocuments.totalPages < page)
    {
      throw new Error(`The total pages is ${ticketsDocuments.totalPages}`);
    }

    const tickets = ticketsDocuments.docs.map(doc => new Ticket(
      {
        id: doc._id,
        code: doc.code,
        purchase_datetime: doc.purchase_datetime,
        information: doc.information,
        enable: doc.enable
      }
    ));

    return {
      payload: tickets,
      ...ticketsDocuments
    };
  }

  async getOne(filter)
  {
    const ticketDocument = await TicketModel.findOne(filter);

    return new Ticket(
      {
        id: ticketDocument._id,
        code: ticketDocument.code,
        purchase_datetime: ticketDocument.purchase_datetime,
        information: ticketDocument.information,
        enable: ticketDocument.enable
      }
    );
  }

  async getOneByPaymentId(id)
  {
    const ticketDocument = await TicketModel.findOne(id);

    return new Ticket(
      {
        id: ticketDocument._id,
        code: ticketDocument.code,
        purchase_datetime: ticketDocument.purchase_datetime,
        information: ticketDocument.information,
        enable: ticketDocument.enable
      }
    );
  }

  async create(data)
  {
    const newTicketDoc = await TicketModel.create(data);

    return new Ticket(
      {
        id: newTicketDoc._id,
        code: newTicketDoc.code,
        purchase_datetime: newTicketDoc.purchase_datetime,
        information: newTicketDoc.information,
        enable: newTicketDoc.enable
      }
    );
  }

  async update(id, data)
  {
    const ticketDocument = await TicketModel.findByIdAndUpdate({ _id: id }, data);

    return new Ticket(
      {
        id: ticketDocument._id,
        code: ticketDocument.code,
        purchase_datetime: ticketDocument.purchase_datetime,
        information: ticketDocument.information,
        enable: ticketDocument.enable
      }
    );
  }

  async deleteOne(id)
  {
    const ticketDocument = await TicketModel.findByIdAndUpdate({ _id: id }, { enable: false });

    return new Ticket(
      {
        id: ticketDocument._id,
        code: ticketDocument.code,
        purchase_datetime: ticketDocument.purchase_datetime,
        information: ticketDocument.information,
        enable: ticketDocument.enable
      }
    );
  }
}

export default TicketMongooseRepository;
