import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

export class App {
  constructor(logger, userContoller, syncController, exeptionFilter) {
    this.app = express();
    this.port = 8000;
    this.server;
    this.logger = logger;
    this.userContoller = userContoller;
    this.exeptionFilter = exeptionFilter;
    this.syncController = syncController;
  }

  useMiddleware() {
    this.app.use(bodyParser.json());
  }

  useRoutes() {
    this.app.use("/users", this.userContoller.router);
    this.app.use("/sync", this.syncController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  async init() {
    this.app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`The server is running: http://localhost:${this.port}`);
  }
}
