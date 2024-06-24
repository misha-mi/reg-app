import { Router } from "express";


export class BaseContoller {
    constructor(logger) {
        this._router = Router();
        this.logger = logger;
    }

    get router() {
        return this._router;
    }

    send(res, code, message) {
        res.type("application/json");
        return res.status(code).json(message);
    }

    created(res) {
        return res.status(201);
    }

    ok(res, message) {
        return this.send(res, 200, message);
    }

    bindRoutes(routes) {
        routes.forEach((route) => {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middlewares = route.middlewares?.map((m => m.execute.bind(m)));
            const handler = route.func.bind(this);
            const pipeline = middlewares ? [...middlewares, handler]: handler;
            this.router[route.method](route.path, pipeline);
        })
    }
}