export class LoggerRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async create({ context, desc, serverIp, sourceIp }) {
    return this.prismaClient.logger.create({
      data: { context, desc, serverIp, sourceIp },
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
