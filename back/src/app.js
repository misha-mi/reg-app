import bodyParser from "body-parser";
import express from "express";

export class App {
    constructor(logger, userContoller, exeptionFilter) {
        this.app = express();
        this.port = 8000;
        this.server;
        this.logger = logger;
        this.userContoller = userContoller;
        this.exeptionFilter = exeptionFilter;
    }

    useMiddleware() {
        this.app.use(bodyParser.json());
    }

    useRoutes() {
        this.app.use("/users", this.userContoller.router);
    }

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    async init() {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`The server is running: http://localhost:${this.port}`);
    }
}