import { User } from "./user.entity.js";
import jsonwebtoken from "jsonwebtoken";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser({login, name, password}) {
        const isExistUser = await this.userRepository.find(login);
        if(isExistUser) {
            return null;
        }
        const newUser = new User({login, name});
        await newUser.setPassword(password);
        return this.userRepository.create(newUser);
    }

    async validateUser({login, password}) {
        const data = await this.userRepository.find(login);
        if(!data) {
            return null;
        }
        const user = new User(data);
        const isValid = await user.comparePassword(password);
        if(isValid) {
            return user;
        }
        return false;
    }

    async setToken(login, role) {
        const newJWT = await this.signJWT(login, role, "secret") // в env
        await this.userRepository.setToken(login, newJWT);
        return newJWT;
    }

    signJWT(email, role, secret) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign({
                email,
                role,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: "HS256"
            }, (err,token) => {
                if(err) {
                    reject(err);
                }
                resolve(token);
            } );
        })
    }

    async getUsers() {
        const users = await this.userRepository.getAll();
        return users.map(({id, login, name, password}) => {
            return {id, login, name, password};
        });
    }

    async getConfig(login) {
        const user = await this.userRepository.getUser(login);
        const [usersLogin, domain] = user.login.split("@");
        return {
            login: usersLogin,
            domain,
            pass: user.password,
            ip: "something"
        }
    }
}