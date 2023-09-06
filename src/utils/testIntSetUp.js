import RoleMongooseRepository from '../data/repositories/mongoose/RoleMongooseRepository';

class TestIntSetUp
{
  constructor()
  {
    this.roleRepository = new RoleMongooseRepository();
    this.request = null;
    this.payload = {};
    this.idRole = '';
  }
  async createRole(role)
  {
    let roleAsign = {
      name: 'admin',
      permissions: {
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
          'deleteAllProducts'
        ],
        tickets: [
          'create',
          'getList',
          'getOne',
          'update',
          'delete'
        ]
      },
      enable: true
    }; // default admin

    if (role === 'client')
    {
      roleAsign = {
        name: 'client',
        permissions: {
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
            'addProduct'
          ]
        },
        enable: true
      };
    }

    const response = await this.roleRepository.create(roleAsign);
    const { id, name } = response;

    if (name === role.name) this.idRole = id;
  }

  async userSingUp(request)
  {
    this.request = request;

    const payload = {
      firstName: 'UserTest',
      lastName: 'Test',
      age: 19,
      email: 'usertest@node.com',
      password: 'hola123456',
      role: 'admin'
    };

    const response = await this.request
          .post('/api/sessions/signup')
          .set('Content-Type', 'application/json')
          .send(payload);

    const { _body } = response;

    if (payload.email === _body.user.email)
    {
      this.payload = { email: payload.email, password: payload.password };
    }
  }

  async userLogin()
  {
    const response = await this.request
          .post('/api/sessions/login')
          .set('Content-Type', 'application/json')
          .send(this.payload);

    const { status, _body } = response;
    const { token } = _body;

    if (status  === 200) return token;
  }
}

export default TestIntSetUp;

