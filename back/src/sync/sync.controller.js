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

  async register({ body }, res, next) {
    await this.userController.writeUserToBD(body);
    this.ok(res, `${global.IP}: Create success (id:${body.id})`);
  }

  async removeUser(req, res, next) {
    const id = req.params.id;
    await this.userController.removeUserFromBD(id);
    this.ok(res, `${global.IP}: Remove success (id:${id})`);
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
