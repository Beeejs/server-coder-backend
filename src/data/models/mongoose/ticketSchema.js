import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ticketCollection = 'tickets';

const ticketModel = new Schema(
  {
    code: { type: Schema.Types.String, required: true, unique: true, index: true },
    purchase_datetime: { type: Schema.Types.Date, required: true },
    information: {
      payer: {
        address: {
          street_name: { type: Schema.Types.String, required: false },
          street_number: { type: Schema.Types.String, required: false },
          zip_code: { type: Schema.Types.String, required: false }
        },
        first_name: { type: Schema.Types.String, required: true },
        last_name: { type: Schema.Types.String, required: true },
        identification: {
          number: { type: Schema.Types.String, required: false },
          type: { type: Schema.Types.String, required: false }
        },
        phone: {
          area_code: { type: Schema.Types.String, required: false },
          number: { type: Schema.Types.String, required: false }
        },
        email: { type: Schema.Types.String, required: true }
      },
      payment_id: { type: Schema.Types.String, required: true },
      products: { type: Schema.Types.Array, required: true },
      mount: { type: Schema.Types.Number, required: true },
      method: { type: Schema.Types.String, required: false },
      card: { type: Schema.Types.String, required: false },
      state_transaction: { type: Schema.Types.String, required: false },
      installments: { type: Schema.Types.Number, required: false }
    },
    enable: { type: Schema.Types.Boolean, default: true }
  },
  {
    versionKey: false
    // timestamps: true
  }
);

ticketModel.plugin(mongoosePaginate);

export const TicketModel = model(ticketCollection, ticketModel);
