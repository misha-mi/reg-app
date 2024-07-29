export class LoggerRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async create({ type, context, desc, ip }) {
    return this.prismaClient.logger.create({
      data: { type, context, desc, ip },
    });
  }
}
