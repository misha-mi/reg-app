import { App } from "./app.js";
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UserService } from "./users/users.service.js";
import { UserController } from "./users/users.controller.js";
import { UserRepository } from "./users/user.repository.js";
import { PrismaClient } from "@prisma/client";
import { SyncController } from "./sync/sync.controller.js";

async function bootstrap() {
  const prismaClient = new PrismaClient();
  const logger = new LoggerService(prismaClient, process.env.IP);

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

  const userRepository = new UserRepository(prismaClient);
  const userService = new UserService(userRepository);
  const userContoller = new UserController(logger, userService);

  const app = new App(
    logger,
    userContoller,
    new SyncController(logger, userContoller),
    new ExeptionFilter(logger)
  );
  await app.init();
}

bootstrap();
