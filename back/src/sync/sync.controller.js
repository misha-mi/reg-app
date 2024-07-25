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
    const ip = req.ip.split(":").pop();
    await this.userController.writeUserToBD(req.body);
    this.logger.log({
      context: "create",
      desc: `User has been created (sync) (ID: ${req.body.id})`,
      isAudit: true,
      ip,
    });
    this.ok(res, `${global.IP}: Create success (id:${req.body.id})`);
  }

  async removeUser(req, res, next) {
    const ip = req.ip.split(":").pop();
    const id = req.params.id;
    await this.userController.removeUserFromBD(id);
    this.logger.log({
      context: "remove",
      desc: `The user has been deleted (sync) (ID: ${id})`,
      isAudit: true,
      ip,
    });
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
