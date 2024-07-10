export class UserRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async create({ login, name, password, role, number }) {
    return this.prismaClient.user.create({
      data: { login, name, password, role, number },
    });
  }

  async find(login) {
    return this.prismaClient.user.findFirst({
      where: { login },
    });
  }

  async findByNumber(number) {
    return this.prismaClient.user.findFirst({
      where: { number },
    });
  }

  async setToken(id, token) {
    return this.prismaClient.user.update({
      where: { id },
      data: { token },
    });
  }

  async getUser(id) {
    return this.prismaClient.user.findFirst({
      where: { id },
    });
  }

  async getAll() {
    return this.prismaClient.user.findMany({
      where: { role: "user" },
    });
  }

  async remove(id) {
    return this.prismaClient.user.delete({
      where: { id },
    });
  }
}
