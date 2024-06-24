import { User } from "./user.entity.js";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser({login, name, password}) {
        const isExistUser = await this.userRepository.find(login);
        if(isExistUser) {
            return null;
        }
        const newUser = new User(login, name);
        await newUser.setPassword(password);
        console.log(newUser);
        return this.userRepository.create(newUser);
    }

    async validateUser(dto) { // Проверка наличия пользователя
        return true;
    }
}