import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";

export class App {
  constructor(logger, userContoller, syncController, exeptionFilter) {
    this.app = express();
    this.port = process.env.SERVER_PORT;
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
        origin: `http://${process.env.IP}:${process.env.CLIENT_PORT}`,
      })
    );
    this.app.use(function (req, res, next) {
      res.setHeader(
        "Access-Control-Allow-Origin",
        `http://${process.env.IP}:${process.env.CLIENT_PORT}`
      );
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", true);
      next();
    });
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log({
      context: "run",
      desc: `The server is running: http://${process.env.IP}:${this.port}`,
      isAudit: true,
    });
  }
}
