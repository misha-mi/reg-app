import { ValidateMethods } from "../../common/validate.methods.js";
import { HTTPError } from "../../errors/http-error.class.js";

export class UserLoginDto extends ValidateMethods {
    constructor({login, password}) {
        super();
        this.login = login;
        this.password = password;
    }

    validate(next) {
        const errors = [];

        let error = this.validateLogin(this.login);
        error? errors.push(error): null;

        if(errors.length) {
            next(new HTTPError(422, errors, "login"));
        }
    }
}