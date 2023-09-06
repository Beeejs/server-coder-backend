// TODO: AGREGAR PERMISOS DE PAYMENT Y CORROBORAR QUE ESTEN TODOS BIEN
/* Dotenv */
/* import dotenv from 'dotenv';
dotenv.config(); */
export const HOST =
process.env.NODE_ENV === 'development'
? `http://localhost:${process.env.PORT}`
: process.env.HOST;

export const FRONT =
process.env.NODE_ENV === 'development'
? 'http://localhost:3000'
: process.env.URL_FRONT;

export const configCookiesRefresh = process.env.NODE_ENV === 'development'
?
  {
    maxAge: 60 * 60 * 1000,
    httpOnly: true
  }
:
  {
    maxAge: 60 * 60 * 1000,
    httpOnly: false,
    secure: true,
    sameSite: 'none'
    // domain: process.env.DOMAIN_HOST
  };


const defaultsPermissions = {
  client: {
    roles: [],
    products: [
      'getList',
      'getOne'
    ],
    users: [],
    sessions: [
      'login',
      'register',
      'current'
    ],
    carts: [
      'getOne',
      'cleanProducts',
      'addProduct',
      'create',
      'getOneByUser',
      'deleteAllProduct',
      'deleteProduct'
    ],
    tickets: [
      'getOneByPaymentId'
    ],
    payments: [
      'createOrder'
    ]
  },
  admin:{
      roles: [
        'create',
        'getList',
        'getOne',
        'update',
        'delete'
      ],
      products: [
        'create',
        'getList',
        'getOne',
        'update',
        'delete'
      ],
      users: [
        'create',
        'getList',
        'getOne',
        'update',
        'delete'
      ],
      sessions: [
        'login',
        'register',
        'current'
      ],
      carts: [
        'create',
        'getOne',
        'cleanProducts',
        'deleteProduct',
        'addProduct',
        'deleteAllProduct',
        'getOneByUser'
      ],
      tickets: [
        'create',
        'getList',
        'getOne',
        'getOneByPaymentId',
        'update',
        'delete'
      ],
      payments: [
        'createOrder'
      ]
  }
};

export const defaultsRole = [
  {

    name: 'client',
    permissions: defaultsPermissions.client

  },
  {

    name: 'admin',
    permissions: defaultsPermissions.admin

  }
];

export const defaultsPaymentServices = [
  {
    mercadopago:
    {
      title: 'mercadopago',
      isActive: true
    },
    paypal:
    {
      title: 'paypal',
      isActive: true
    }
  }
];
