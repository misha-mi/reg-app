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

// const localIP = Object.values(os.networkInterfaces())
//   .flat()
//   .find(
//     (iface) =>
//       iface.family === "IPv4" &&
//       !iface.internal &&
//       iface.address === "192.168.1.87"
//   )?.address;

// console.log("Локальный IP-адрес:", localIP);

function getIPs() {
  let myIP;
  let otherIp = [];
  const localIPs = Object.values(os.networkInterfaces())
    .flat()
    .filter((iface) => iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address);
  const IPs = fs
    .readFileSync("/usr/bin/ip.txt", "utf8")
    .split("\n")
    .filter((ip) => ip.length);
  IPs.forEach((ip) => {
    if (localIPs.includes(ip)) {
      myIP = ip;
    } else if (myIP) {
      otherIp.push(ip);
    }
  });
  return [myIP, otherIp];
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  const loggerRepository = new LoggerRepository(prismaClient);
  const logger = new LoggerService(loggerRepository);

  const userRepository = new UserRepository(prismaClient);
  const userService = new UserService(userRepository);
  const userContoller = new UserController(logger, userService);

  console.log(
    await prismaClient.user.findMany({
      where: {
        NOT: [
          { id: "14286e95-34c3-4252-948d-5b17fcb4a13c" },
          { id: "018170ab-552b-47dd-92ad-8d3a5cfad017" },
          { id: "14286e95-34c3-4252-948d-5b17fcb4a13c" },
          { id: "1fc935aa-c38f-4d6c-b72d-2f175a8bafea" },
        ],
      },
    })
  );

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
    new SyncController(logger, userContoller),
    new ExeptionFilter(logger)
  );
  await app.init();
}

[global.IP, global.OTHER_IPS] = getIPs();
bootstrap();
