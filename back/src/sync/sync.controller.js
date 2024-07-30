import { BaseContoller } from "../common/base.controller.js";
import request from "request";

export class SyncController extends BaseContoller {
  constructor(logger, syncService) {
    super(logger);
    this.syncService = syncService;
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
      {
        method: "post",
        path: "/syncUpdate",
        func: this.syncUpdate,
        middleware: [],
      },
    ]);
  }

  async test(req, res, next) {
    this.ok(res, { resp: "hi" });
  }

  async register(req, res, next) {
    const ip = req.ip.split(":").pop();
    await this.syncService.writeUserToBD(req.body);
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
    await this.syncService.removeUserFromBD(id);
    this.logger.log({
      context: "remove",
      desc: `The user has been deleted (sync) (ID: ${id})`,
      isAudit: true,
      ip,
    });
    this.ok(res, `${global.IP}: Remove success (id:${id})`);
  }

  async logUpdate(objectRC) {
    for (let id in objectRC) {
      if (objectRC[id] === "remove") {
        this.logger.log({
          context: "remove",
          desc: `The user has been deleted (sync) (ID: ${id})`,
          isAudit: true,
        });
      } else {
        this.logger.log({
          context: "create",
          desc: `User has been created (sync) (ID: ${id})`,
          isAudit: true,
        });
      }
    }
  }

  sendUpdateData(compareObj, ip) {
    request.post(
      {
        url: `http://${ip}:${process.env.SERVER_PORT}/sync/syncUpdate`,
        json: {
          compareObj,
          remoteIp: global.IP,
        },
      },
      async (err, resp, body) => {
        if (err) {
          console.log(err);
        } else {
          await this.syncService.syncUpdate(body, ip);
          this.logUpdate(body);
        }
      }
    );
  }

  async syncAudit(req, res, next) {
    // Тут необходимо поднимать сервисы
    const oldIP = req.params.ip;
    if (oldIP === global.IP) {
      return this.ok(res, "It's my ip");
    }
    request.get(
      {
        url: `http://${oldIP}:${process.env.SERVER_PORT}/sync/getRCOobject`,
      },
      async (err, resp, body) => {
        if (err) {
          console.log(err);
        } else {
          const data = JSON.parse(body);
          const eventsDB = await this.logger.getRCEvents();
          const [remoteCompare, localCompare] =
            await this.syncService.comparisonRCObject(data, eventsDB);

          const sendData = {
            remoteCompare: localCompare,
            localCompare: remoteCompare,
          };
          this.sendUpdateData(sendData, oldIP);
          this.ok(res, sendData);
        }
      }
    );
  }

  async syncUpdate({ body }, res, next) {
    const convertedRemoteCompare = await this.syncService.syncUpdate(
      body.compareObj,
      body.remoteIp
    );
    await this.logUpdate(body.localCompare);
    this.ok(res, convertedRemoteCompare);
  }

  async getRCObject(req, res, next) {
    const eventsDB = await this.logger.getRCEvents();
    const RCObject = await this.syncService.generateRCObject(eventsDB);
    this.ok(res, RCObject);
  }

  async getAudit(req, res, next) {
    console.log(`Success getAudit ${req.params.ip}`);
    this.ok(res, `Success getAudit ${req.params.ip}`);
  }
}
