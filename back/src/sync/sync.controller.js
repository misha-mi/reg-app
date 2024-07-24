import { BaseContoller } from "../common/base.controller.js";

export class SyncController extends BaseContoller {
  constructor(logger, userController) {
    super(logger);
    this.userController = userController;
    this.bindRoutes([
      {
        method: "get",
        path: "/test",
        func: this.test,
        middleware: [],
      },
      {
        method: "post",
        path: "/register",
        func: this.register,
        middleware: [],
      },
      {
        method: "delete",
        path: "/delete/:id",
        func: this.removeUser,
        middleware: [],
      },
      {
        method: "get",
        path: "/syncAudit/:ip",
        func: this.syncAudit,
        middleware: [],
      },
      {
        method: "get",
        path: "/getAudit/:ip",
        func: this.getAudit,
        middleware: [],
      },
    ]);
  }

  async test(req, res, next) {
    this.ok(res, { resp: "hi" });
  }

  async register(req, res, next) {
    req.locals.isSync = true;
    this.userController.register(req, res, next);
  }

  async removeUser(req, res, next) {
    req.locals.isSync = true;
    this.userController.removeUser(req, res, next);
  }

  async syncAudit(req, res, next) {
    console.log(`Success syncAudit ${req.params.ip}`);
    this.ok(res, `Success syncAudit ${req.params.ip}`);
  }

  async getAudit(req, res, next) {
    console.log(`Success getAudit ${req.params.ip}`);
    this.ok(res, `Success getAudit ${req.params.ip}`);
  }
}
