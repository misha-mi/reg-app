import { BaseContoller } from "../common/base.controller.js";
import request from "request";

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
      {
        method: "get",
        path: "/getRCOobject",
        func: this.getRCObject,
        middleware: [],
      },
    ]);
  }

  async test(req, res, next) {
    this.ok(res, { resp: "hi" });
  }

  async generateRCObject() {
    const eventsDB = await this.logger.getRCEvents();
    const RCObject = {};
    eventsDB.forEach(({ desc, context }) => {
      const userId = desc.match(/\: ([^}]+)\)/)[1];
      RCObject[userId] = context;
    });
    return RCObject;
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
    // Тут необходимо поднимать сервисы
    const oldIP = req.params.ip;
    const RCObject = await request.get(
      {
        url: `http://${oldIP}:${process.env.SERVER_PORT}/sync/getRCOobject`,
      },
      (err, resp, body) => {
        if (err) {
          console.log(err);
        } else {
          const data = JSON.parse(body);
          this.comparisonRCObject(data);
          this.ok(res, data);
        }
      }
    );
  }

  async comparisonRCObject(RCObject) {
    const localRCObject = await this.generateRCObject();
    const compareRCObj = {};
    console.log(RCObject, localRCObject);
    for (var id in RCObject) {
      if (localRCObject[id] !== RCObject[id] || !localRCObject[id]) {
        compareRCObj[id] = RCObject[id];
      } else {
        delete RCObject[id];
      }
    }
    console.log({ ...compareRCObj, ...RCObject });
  }

  async getRCObject(req, res, next) {
    const RCObject = await this.generateRCObject();
    this.ok(res, RCObject);
  }

  async getAudit(req, res, next) {
    console.log(`Success getAudit ${req.params.ip}`);
    this.ok(res, `Success getAudit ${req.params.ip}`);
  }
}
