import { User } from "./user.entity.js";
import jsonwebtoken from "jsonwebtoken";
import { exec } from "child_process";
import fs from "fs";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async doCommandLine(command, serviceName) {
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

  createSIPUser(phoneNumber, password) {
    const configString = `
[${phoneNumber}]
deny=0.0.0.0/0.0.0.0
secret=${password}
dtmfmode=rfc2833
canreinvite=no
context=from-internal
host=dynamic
defaultuser=
trustrpid=yes
user_eq_phone=no
sendrpid=pai
type=friend
session-timers=accept
nat=force_rport,comedia
port=5060
qualify=yes
qualifyfreq=60
transport=udp
avpf=no
force_avp=no
icesupport=no
rtcp_mux=no
encryption=no
videosupport=yes
namedcallgroup=
namedpickupgroup=
dial=SIP/${phoneNumber}
accountcode=
permit=0.0.0.0/0.0.0.0
callerid=${phoneNumber} <${phoneNumber}>
callcounter=yes
faxdetect=no
`;
    fs.appendFileSync(
      "/home/user/sip-bs/data/izpbx/etc/asterisk/sip_custom.conf", // .env
      configString,
      function (error) {
        if (error) throw error; // если возникла ошибка
        console.log("Асинхронная запись файла завершена. Содержимое файла:");
        let data = fs.readFileSync("hello.txt", "utf8");
        console.log(data);
      }
    );
    this.doCommandLine("docker exec -i izpbx fwconsole reload", "sip-bs");
  }

  removeSIPUser(phoneNumber) {
    let sipUsers = fs
      .readFileSync(
        "/home/user/sip-bs/data/izpbx/etc/asterisk/sip_custom.conf",
        "utf8",
        function (error, data) {
          console.log("Асинхронное чтение файла");
          if (error) throw error; // если возникла ошибка
          console.log(data); // выводим считанные данные
        }
      )
      .split("\n\n");
    const configString = sipUsers.reduce((string, sipUser) => {
      if (sipUser.includes(`[${phoneNumber}]`)) {
        return string;
      } else {
        return string + sipUser + "\n\n";
      }
    }, "");

    fs.writeFileSync(
      "/home/user/sip-bs/data/izpbx/etc/asterisk/sip_custom.conf", // .env
      configString,
      function (error) {
        if (error) throw error; // если возникла ошибка
        console.log("Асинхронная запись файла завершена. Содержимое файла:");
        let data = fs.readFileSync("hello.txt", "utf8");
        console.log(data);
      }
    );
    this.doCommandLine("docker exec -i izpbx fwconsole reload", "sip-bs");
  }

  async removeMailUser(login) {
    const [loginName, domain] = login.split("@");
    const arrSumbol = loginName.split("");
    if (arrSumbol.length < 3) {
      arrSumbol.push("_", "_", "_");
    }

    const removeFromDB = `docker exec -i mail_bs mysql<<MYSQL_SCRIPT 
USE vmail;
DELETE FROM mailbox WHERE username="${login}";
MYSQL_SCRIPT`;
    const removeUsersFiles = `docker exec -i mail_bs rm -rf /var/vmail/vmail1/${domain}/${arrSumbol[0]}/${arrSumbol[1]}/${arrSumbol[2]}/${loginName}-*`;

    await this.doCommandLine(removeFromDB, "mail-bs");
    await this.doCommandLine(removeUsersFiles, "mail-bs");
  }

  async createUser({ login, name, password, number }) {
    const isExistEmail = await this.userRepository.find(login);
    const isExistNumber = await this.userRepository.findByNumber(number);
    if (isExistEmail && isExistNumber) {
      return [
        "A user with this login already exists",
        "A user with this SIP number already exists",
      ];
    } else if (isExistEmail) {
      return "A user with this login already exists";
    } else if (isExistNumber) {
      return "A user with this SIP number already exists";
    }
    const newUser = new User({ login, name, number });

    await newUser.setPassword(password);
    await this.doCommandLine(
      `docker exec -i msg prosodyctl register ${newUser.login.split("@")[0]} ${
        newUser.login.split("@")[1]
      } ${password}`,
      "msg-bs"
    );
    await this.doCommandLine(
      `docker exec -i mail_bs /opt/iredmail/bin/create_user ${login} ${password} 0`,
      "mail-bs"
    );
    this.createSIPUser(number, password);

    return this.userRepository.create(newUser);
  }

  async removeUser(id) {
    try {
      const { login, number } = await this.userRepository.getUser(id);
      this.removeSIPUser(number);
      await this.doCommandLine(
        `docker exec -i msg prosodyctl deluser ${login}`,
        "msg-bs"
      );
      await this.removeMailUser(login);
      const user = await this.userRepository.remove(id);
      return user;
    } catch {
      return null;
    }
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
    return users.map(({ id, login, name }) => {
      const [loginName, domain] = login.split("@");
      return { id, login: loginName, domain, name };
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
