import { User } from "./user.entity.js";
import jsonwebtoken from "jsonwebtoken";
import { exec } from "child_process";
import { stderr, stdout } from "process";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  doCommandLine(command, serviceName) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`[${serviceName}] error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`[${serviceName}] stderr: ${stderr}`);
        return;
      }
      console.log(`[${serviceName}] stdout: ${stdout}`);
    });
  }

  async createUser({ login, name, password }) {
    const isExistUser = await this.userRepository.find(login);
    if (isExistUser) {
      return null;
    }
    const newUser = new User({ login, name });
    await newUser.setPassword(password);
    // this.doCommandLine(
    //   `docker exec -it msg prosodyctl register ${newUser.login.split("@")[0]} ${
    //     newUser.login.split("@")[1]
    //   } ${password}`,
    //   "msg-bs"
    // );
    return this.userRepository.create(newUser);
  }

  async validateUser({ login, password }) {
    const data = await this.userRepository.find(login);
    if (!data) {
      return null;
    }
    const user = new User(data);
    const isValid = await user.comparePassword(password);
    if (isValid) {
      return user;
    }
    return false;
  }

  async setToken(id, role) {
    const newJWT = await this.signJWT(id, role, "secret"); // в env
    await this.userRepository.setToken(id, newJWT);
    return newJWT;
  }

  signJWT(id, role, secret) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(
        {
          id,
          role,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      );
    });
  }

  async getUsers() {
    const users = await this.userRepository.getAll();
    return users.map(({ id, login, name, password }) => {
      return { id, login, name };
    });
  }

  async getConfig(id) {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      return null;
    }
    const [login, domain] = user.login.split("@");
    return {
      login,
      domain,
      pass: user.password,
      ip: "something",
    };
  }

  async removeUser(id) {
    try {
      const user = await this.userRepository.remove(id);
      return user;
    } catch {
      return null;
    }
  }

  async getUser(id) {
    try {
      const data = await this.userRepository.getUser(id);
      const user = new User(data);
      return user;
    } catch {
      return null;
    }
  }
}
