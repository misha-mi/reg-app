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
                    new AuthMiddleware({context:"register", role:"admin"}), 
                    new ValidateMiddleware(UserRegisterDto)
                ]
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
            return next(new HTTPError(422, "The user already exists", "register"));
        }
        this.logger.log(`[register] User has been created (name: ${result.name})`)
        this.ok(res, {login: result.login});
    }

    async login(req, res, next) {
        const result = await this.userService.validateUser(req.body);
        if(result) {
            const jwt = await this.userService.setToken(result.login, result.role);
            this.ok(res, jwt);
        } else {
            next(new HTTPError(401, "Unauthorized", "login"))
        }
    }

    async getUsers(req, res, next) {

    }

    async getConfig(req , res, next) {

    }

    async removeUser(req, res, next) {

    }
}