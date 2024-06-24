import {App} from "./app.js";
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UserService } from "./users/users.service.js";
import { UserController } from "./users/users.controller.js";
import { UserRepository } from "./users/user.repository.js";
import { PrismaClient } from "@prisma/client";

async function bootstrap() {
    const logger = new LoggerService();

    const prismaClient = new PrismaClient();
    try {
        await prismaClient.$connect();
        logger.log("[Prisma] Successful connection to the database");
    } catch(e) {
        logger.error(`[Prisma] Database connection error: ${e.message}`);
    }

    const userRepository = new UserRepository(prismaClient);
    const userService = new UserService(userRepository);

    const app = new App(
        logger, 
        new UserController(logger, userService), 
        new ExeptionFilter(logger)
    );
    await app.init();
}

bootstrap();