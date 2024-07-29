import bcryptjs from "bcryptjs";

export class User {
  constructor({
    login,
    name,
    password,
    id,
    number,
    role = "user",
    isReg = false,
  }) {
    this._login = login;
    this._name = name;
    this._role = role;
    this._password = password;
    this._id = id;
    this._number = number;
    this._isReg = isReg;
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

  get number() {
    return this._number;
  }

  get isReg() {
    return this._isReg;
  }

  async setPassword(pass) {
    this._password = await bcryptjs.hash(pass, +process.env.PASSWORD_SALT);
  }

  async comparePassword(pass) {
    return bcryptjs.compare(pass, this._password);
  }
}
