import { BaseContoller } from "../common/base.controller.js";
import request from "request";
import doCommandLine from "../common/do-command-line.js";

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
        path: "/upServeses/:ip",
        func: this.upServeses,
        middleware: [],
      },
      {
        method: "get",
        path: "/pushDateToNewServ/:ip",
        func: this.pushDateToNewServ,
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
    const ip = req.ip.split(":").pop(); // это же ip адресс сервера, который инициализирует запрос синхронизации, нужен IP источника запроса на создание/удаление
    await this.syncService.writeUserToBD(req.body);
    this.logger.log({
      context: "create",
      desc: `User has been created (sync) (ID: ${req.body.id})`,
      isAudit: true,
      sourceIp: ip,
    });
    this.ok(res, `${global.IP}: Create success (id:${req.body.id})`);
  }

  async removeUser(req, res, next) {
    const ip = req.ip.split(":").pop(); // это же ip адресс сервера, который инициализирует запрос синхронизации, нужен IP источника запроса на создание/удаление
    const id = req.params.id; // Добавить в конвертер RCO преобразвание в массив типа id:{event, sourceIP}?
    await this.syncService.removeUserFromBD(id);
    this.logger.log({
      context: "remove",
      desc: `The user has been deleted (sync) (ID: ${id})`,
      isAudit: true,
      sourceIp: ip,
    });
    this.ok(res, `${global.IP}: Remove success (id:${id})`);
  }

  async logUpdate(objectRC, serverIp) {
    for (let id in objectRC) {
      if (objectRC[id] === "remove") {
        this.logger.log({
          serverIp,
          context: "remove",
          desc: `The user has been deleted (sync) (ID: ${id})`,
          isAudit: true,
        });
      } else {
        this.logger.log({
          serverIp,
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
          this.logUpdate(body, ip);
        }
      }
    );
  }

  upServeses(req, res, next) {
    doCommandLine(
      `docker compose -f /home/${process.env.USER_NAME}/final/docker-compose.yml up -d`,
      "sync"
    );
    return this.ok(res, "Up on " + global.IP);
  }

  pushDateToNewServ(req, res, next) {
    const newServIP = req.params.ip;
    console.log("Push to " + newServIP);
    return this.ok(res, "Push to " + newServIP);
  }

  async syncAudit(req, res, next) {
    doCommandLine(
      `docker compose -f /home/${process.env.USER_NAME}/final/docker-compose.yml up -d`,
      "sync"
    );
    const oldIP = req.params.ip;
    console.log("Sync with" + oldIP);
    this.logger.log({
      context: "syncAudit",
      desc: `Syncing credentials`,
      isAudit: true,
      sourceIp: oldIP,
    });

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
          this.ok(res, "success"); // Тут
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
    doCommandLine(
      `docker compose -f /home/${process.env.USER_NAME}/final/ down`,
      "sync"
    );
    const eventsDB = await this.logger.getRCEvents();
    const RCObject = await this.syncService.generateRCObject(eventsDB);
    this.ok(res, RCObject);
  }
}
