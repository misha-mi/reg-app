import { App } from "./app.js";
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UserService } from "./users/users.service.js";
import { UserController } from "./users/users.controller.js";
import { UserRepository } from "./users/user.repository.js";
import { PrismaClient } from "@prisma/client";
import { SyncController } from "./sync/sync.controller.js";
import os from "os";
import fs from "fs";
import { LoggerRepository } from "./logger/logger.repository.js";
import { SyncService } from "./sync/sync.service.js";

function getIPs() {
  let myIP;
  let otherIp = [];
  let allIp = [];
  const localIPs = Object.values(os.networkInterfaces())
    .flat()
    .filter((iface) => iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address);
  const IPs = fs
    .readFileSync("/usr/bin/ip.txt", "utf8")
    .split("\n")
    .filter((ip) => ip.length);
  IPs.forEach((ip) => {
    allIp.push(ip);
    if (localIPs.includes(ip)) {
      myIP = ip;
    } else if (myIP) {
      otherIp.push(ip);
    }
  });
  return [myIP, otherIp, allIp];
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  const loggerRepository = new LoggerRepository(prismaClient);
  const logger = new LoggerService(loggerRepository);

  const userRepository = new UserRepository(prismaClient);
  const userService = new UserService(userRepository);
  const userContoller = new UserController(logger, userService);

  const syncService = new SyncService(userRepository);
  const syncController = new SyncController(logger, syncService);

  try {
    await prismaClient.$connect();
    logger.log({
      context: "database",
      desc: "Successful connection to the database",
      isAudit: true,
    });
  } catch (e) {
    logger.error({
      context: "database",
      desc: `Database connection error: ${e.message}`,
      isAudit: true,
    });
  }

  const app = new App(
    logger,
    userContoller,
    syncController,
    new ExeptionFilter(logger)
  );
  await app.init();
}

[global.IP, global.OTHER_IPS, global.ALL_IPS] = getIPs();
bootstrap();
