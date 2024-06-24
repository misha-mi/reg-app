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
        const newUser = new User(login, name);
        await newUser.setPassword(password);
        return this.userRepository.create(newUser);
    }

    async validateUser({login, password}) {
        const data = await this.userRepository.find(login);
        if(!data) {
            return null;
        }
        const user = new User(data.login, data.name, data.password);
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
}