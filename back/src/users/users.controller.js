import { AuthMiddleware } from "../common/auth.middleware.js";
import { BaseContoller } from "../common/base.controller.js";
import { ValidateMiddleware } from "../common/validate.middleware.js";
import { HTTPError } from "../errors/http-error.class.js";
import { UserLoginDto } from "./dto/user-login.dto.js";
import { UserRegisterDto } from "./dto/user-register.dto.js";
import removeRemoteUser from "../common/remove-remote-user.js";
import createRemoteUser from "../common/create-remote-user.js";

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
      {
        method: "get",
        path: "/getLogs",
        func: this.getLogs,
        middlewares: [
          new AuthMiddleware({ context: "getLogs", role: ["admin"] }),
        ],
      },
    ]);
  }

  async register(req, res, next) {
    const ip = req.ip.split(":").pop();
    const result = await this.userService.createUser(req.body);
    if (typeof result === "string" || Array.isArray(result)) {
      return next(new HTTPError(422, result, "register"));
    }
    const { login, name, id, number, password, role } = result;
    createRemoteUser({
      name,
      login,
      password,
      number,
      id,
      role,
    });
    this.logger.log({
      context: "create",
      desc: `User has been created. (ID: ${result.id})`,
      isAudit: true,
      sourceIp: ip,
    });
    const [loginName, domain] = login.split("@");
    this.ok(res, { login: loginName, domain, name, id, number });
  }

  async login(req, res, next) {
    const ip = req.ip.split(":").pop();
    const result = await this.userService.validateUser(req.body);
    if (result) {
      const jwt = await this.userService.setToken(result.id, result.role);
      result.role === "admin"
        ? this.logger.log({
            context: "login",
            desc: `The admin has logged in. (name: ${result.name})`,
            isAudit: true,
            sourceIp: ip,
          })
        : null;
      res.cookie("accessToken", jwt, { maxAge: 3600000, httpOnly: true });
      this.ok(res, { role: result.role, id: result.id });
    } else {
      this.logger.error({
        context: "login",
        desc: `Failed authorization attempt`,
        isAudit: true,
        sourceIp: ip,
      });
      next(new HTTPError(401, "Invalid login or password", "login"));
    }
  }

  async getUsers(req, res, next) {
    const users = await this.userService.getUsers();
    this.ok(res, { users });
  }

  async getConfig(req, res, next) {
    const ip = req.ip.split(":").pop();
    const { id, password } = req.body;
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
        sourceIp: ip,
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
    const ip = req.ip.split(":").pop();
    const id = req.params.id;
    const user = await this.userService.removeUser(id);
    if (!user) {
      return next(
        new HTTPError(422, "There is no user with this ID", "removeUser")
      );
    }
    removeRemoteUser(id);
    this.logger.log({
      context: "remove",
      desc: `The user has been deleted (ID: ${id})`,
      isAudit: true,
      sourceIp: ip,
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

  async removeUsers(req, res, next) {
    const ip = req.ip.split(":").pop();
    const status = await this.userService.removeUsers(req.body);
    if (!status) {
      return next(new HTTPError(422, "Something broke down", "removeUsers"));
    }
    req.body.forEach((id) => {
      this.logger.log({
        context: "remove",
        desc: `The users has been deleted (ID: ${id})`,
        isAudit: true,
        sourceIp: ip,
      });
      removeRemoteUser(id);
    });
    this.ok(res, status);
  }

  async getLogs(req, res, next) {
    const logs = await this.logger.getLogs();
    this.ok(res, logs);
  }
}
