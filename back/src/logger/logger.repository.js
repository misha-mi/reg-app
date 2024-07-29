export class LoggerRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async create({ type, context, desc, ip }) {
    return this.prismaClient.logger.create({
      data: { type, context, desc, ip },
    });
  }

  async getRCEvents() {
    return this.prismaClient.logger.findMany({
      where: {
        OR: [
          {
            context: "remove",
          },
          {
            context: "create",
          },
        ],
      },
    });
  }
}
