import { HTTPError } from "../errors/http-error.class.js";
import jsonwebtoken from "jsonwebtoken";

export class AuthMiddleware {

    constructor({context, role}) {
        this.context = context;
        this.role = role;
    }

    execute({headers}, res, next) {
        const token = headers.authorization;
        if(!token) {
            next(new HTTPError(403, "The token is missing", this.context))
        }

        try {
            const {role} = jsonwebtoken.verify(token, "secret");
            if(role != this.role) {
                next(new HTTPError(403, "Forbidden", this.context))
            }
            next();
        } catch {
            next(new HTTPError(403, "Forbidden", this.context))
        }
    }
}