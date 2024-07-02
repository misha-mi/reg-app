import bcryptjs from "bcryptjs";

export class User {
  constructor({ login, name, password, id, role = "user" }) {
    this._login = login;
    this._name = name;
    this._role = role;
    this._password = password;
    this._id = id;
  }

  get login() {
    return this._login;
  }

  get name() {
    return this._name;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }

  get id() {
    return this._id;
  }

  async setPassword(pass) {
    this._password = await bcryptjs.hash(pass, 10); // соль вытащить в env
  }

  async comparePassword(pass) {
    return bcryptjs.compare(pass, this._password);
  }
}
