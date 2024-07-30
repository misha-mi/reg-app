import request from "request";
import { AuthMiddleware } from "../common/auth.middleware.js";
import { BaseContoller } from "../common/base.controller.js";
import { ValidateMiddleware } from "../common/validate.middleware.js";
import { HTTPError } from "../errors/http-error.class.js";
import { UserLoginDto } from "./dto/user-login.dto.js";
import { UserRegisterDto } from "./dto/user-register.dto.js";

export class UserController extends BaseContoller {
  constructor(logger, userService) {
    super(logger);
    this.userService = userService;
    this.bindRoutes([
      {
        method: "post",
        path: "/register",
        func: this.register,
        middlewares: [
          new AuthMiddleware({ context: "register", role: ["admin"] }),
          new ValidateMiddleware(UserRegisterDto),
        ],
      },
      {
        method: "post",
        path: "/login",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        method: "get",
        path: "/getUsers",
        func: this.getUsers,
        middlewares: [
          new AuthMiddleware({ context: "register", role: ["admin"] }),
        ],
      },
      {
        method: "post",
        path: "/getConfig",
        func: this.getConfig,
        middlewares: [
          // new AuthMiddleware({ context: "getConfig", role: ["admin", "user"] }),
        ],
      },
      {
        method: "delete",
        path: "/deleteConfig/:id",
        func: this.removeConfig,
        middlewares: [
          new AuthMiddleware({ context: "getConfig", role: ["admin", "user"] }),
        ],
      },
      {
        method: "delete",
        path: "/delete/:id",
        func: this.removeUser,
        middlewares: [
          new AuthMiddleware({ context: "delete", role: ["admin"] }),
        ],
      },
      {
        method: "delete",
        path: "/deleteUsers",
        func: this.removeUsers,
        middlewares: [
          new AuthMiddleware({ context: "delete", role: ["admin"] }),
        ],
      },
      {
        method: "get",
        path: "/getUser",
        func: this.getUser,
        middlewares: [
          new AuthMiddleware({ context: "getUser", role: ["admin", "user"] }),
        ],
      },
    ]);
  }

  async register({ body }, res, next) {
    const result = await this.userService.createUser(body);
    if (typeof result === "string" || Array.isArray(result)) {
      return next(new HTTPError(422, result, "register"));
    }
    const { login, name, id, number, password, role } = result;
    global.OTHER_IPS.map((ip) => {
      request.post(
        {
          url: `http://${ip}:${process.env.SERVER_PORT}/sync/register`,
          json: {
            name,
            login,
            password,
            number,
            id,
            role,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sync register success");
          }
        }
      );
    });
    this.logger.log({
      context: "create",
      desc: `User has been created. (ID: ${result.id})`,
      isAudit: true,
    });
    const [loginName, domain] = login.split("@");
    this.ok(res, { login: loginName, domain, name, id, number });
  }

  async login(req, res, next) {
    const result = await this.userService.validateUser(req.body);
    if (result) {
      const jwt = await this.userService.setToken(result.id, result.role);
      this.logger.log({
        context: "login",
        desc: `The user has logged in. (name: ${result.name}, role: ${result.role})`,
        isAudit: true,
      });
      res.cookie("accessToken", jwt, { maxAge: 3600000, httpOnly: true });
      this.ok(res, result.role);
    } else {
      next(new HTTPError(401, "Invalid login or password", "login"));
    }
  }

  async getUsers(req, res, next) {
    const users = await this.userService.getUsers();
    this.ok(res, { users });
  }

  async getConfig({ body }, res, next) {
    const { id, password } = body;
    const pathToConfig = await this.userService.getConfig(id, password);
    if (!pathToConfig) {
      next(
        new HTTPError(500, "Could not get the configuration file", "getConfig")
      );
    } else {
      this.logger.log({
        context: "getConfig",
        desc: `The configuration file has been transferred. (id: ${id})`,
        isAudit: true,
      });
      return res.download(pathToConfig); // вынести в базовый контроллер
      // this.ok(res, config);
    }
  }

  removeConfig(req, res, next) {
    const id = req.params.id;
    this.userService.removeConfig(id);
    this.ok(res, "Success");
  }

  async removeUser(req, res, next) {
    const id = req.params.id;
    const user = await this.userService.removeUser(id);
    if (!user) {
      return next(
        new HTTPError(422, "There is no user with this ID", "removeUser")
      );
    }
    global.OTHER_IPS.forEach((ip) => {
      request.delete(
        {
          url: `http://${ip}:${process.env.SERVER_PORT}/sync/delete/${id}`,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sync remove success");
          }
        }
      );
    });
    this.logger.log({
      context: "remove",
      desc: `The user has been deleted (ID: ${id})`,
      isAudit: true,
    });
    this.ok(res, user.id);
  }

  async getUser(req, res, next) {
    const userId = req?.locals?.id;
    if (!userId) {
      next(new HTTPError(400, "Bad request", "removeUser"));
    }
    const user = await this.userService.getUser(userId);
    if (!user) {
      next(new HTTPError(422, "There is no user with this ID", "removeUser"));
    } else {
      this.logger.log({
        context: "getUser",
        desc: `The user's data has been received (id: ${userId})`,
      });
      const { login, name, id, role } = user;
      const [loginName, domain] = login.split("@");
      this.ok(res, { login: loginName, domain, name, id, role });
    }
  }

  async removeUsers({ body }, res, next) {
    const status = await this.userService.removeUsers(body);
    if (!status) {
      return next(new HTTPError(422, "Something broke down", "removeUsers"));
    }
    body.forEach((id) => {
      this.logger.log({
        context: "remove",
        desc: `The users has been deleted (ID: ${id})`,
        isAudit: true,
      });
      global.OTHER_IPS.forEach((ip) => {
        request.delete(
          {
            url: `http://${ip}:${process.env.SERVER_PORT}/sync/delete/${id}`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("sync remove success");
            }
          }
        );
      });
    });
    this.ok(res, status);
  }
}
