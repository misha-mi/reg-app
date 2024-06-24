export class UserRepository {

    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }

    async create({login, name, password, role}) {
        return this.prismaClient.user.create({
            data: {login, name, password, role}
        });
    }

    async find(login) {
        return this.prismaClient.user.findFirst({
            where: { login }
        });
    }

    async setToken(login, token) {
        return this.prismaClient.user.update({
            where: { login },
            data: { token }
        })
    }
}