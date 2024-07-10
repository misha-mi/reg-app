import { ValidateMethods } from "../../common/validate.methods.js";
import { HTTPError } from "../../errors/http-error.class.js";

export class UserRegisterDto extends ValidateMethods {
  constructor({ login, password, number, name }) {
    super();
    this.login = login;
    this.password = password;
    this.number = number;
    this.name = name;
  }

  validate(next) {
    const errors = [];

    let error = this.validateLogin(this.login);
    error ? errors.push(error) : null;

    error = this.validatePassword(this.password);
    error ? errors.push(error) : null;

    error = this.validateName(this.name);
    error ? errors.push(error) : null;

    error = this.validateNumber(this.number);
    error ? errors.push(error) : null;

    if (errors.length) {
      next(new HTTPError(422, errors, "register"));
    }
  }
}
