
class User
{
  constructor(props)
  {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.age = props.age;
    this.password = props.password;
    this.role = props.role;
    this.last_connection = props.last_connection;
    this.enable = props.enable;
  }
}

export default User;
