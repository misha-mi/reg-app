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
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                method: "post",
                path: "/login",
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]
            }
        ])
    }

    async register({body}, res, next) {
        const result = await this.userService.createUser(body);
        if(!result) {
            return next(new HTTPError(422, "Такой пользователь уже существует", "register"));
        }
        this.ok(res, {login: result.login});
    }

    async login(req, res, next) {
        next(new HTTPError(401, "Пользователь не авторизован", "login"))
        // this.ok(res, "Hi, login");
    }

    async getUsers(req, res, next) {

    }

    async getConfig(req , res, next) {

    }

    async removeUser(req, res, next) {

    }
}