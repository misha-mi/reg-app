import { HTTPError } from "../errors/http-error.class.js";
import jsonwebtoken from "jsonwebtoken";

export class AuthMiddleware {
  constructor({ context, role }) {
    this.context = context;
    this.role = role;
  }

  execute(req, res, next) {
    const cookies = req.headers?.cookie?.split("; ");
    const token = cookies?.filter((item) => item.includes("accessToken"))[0];
    if (!token) {
      next(new HTTPError(403, "The token is missing", this.context));
    }

    try {
      const tokenData = jsonwebtoken.verify(
        token.replace("accessToken=", ""),
        process.env.JWT_SECRET
      );
      const interval = Math.floor(Date.now() / 1000) - tokenData.iat;
      if (!this.role.includes(tokenData.role)) {
        next(new HTTPError(403, "The token is not valid", this.context));
      }
      if (interval > 3600) {
        next(new HTTPError(403, "The token has expired", this.context));
      }
      req.locals = {
        id: tokenData.id,
      };
      next();
    } catch {
      next(new HTTPError(403, "Forbidden", this.context));
    }
  }
}
