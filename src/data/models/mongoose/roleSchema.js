import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const roleCollection = 'roles';

const roleModel = new Schema(
  {
    name: { type: Schema.Types.String, default: 'client', required: true },
    permissions: {
      roles: [{ type: Schema.Types.String }],
      products: [{ type: Schema.Types.String }],
      users: [{ type: Schema.Types.String }],
      sessions: [{ type: Schema.Types.String }],
      carts: [{ type: Schema.Types.String }],
      tickets: [{ type: Schema.Types.String }],
      payments: [{ type: Schema.Types.String }]
    },
    enable: { type: Schema.Types.Boolean, default: true }
  },
  {
    versionKey: false
  }
);

roleModel.plugin(mongoosePaginate);

export const RoleModel = model(roleCollection, roleModel);
