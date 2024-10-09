import { User } from "./user.entity.js";
import jsonwebtoken from "jsonwebtoken";
import { exec } from "child_process";
import fs from "fs";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  doCommandLine(command, serviceName, call) {
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
      if (call) {
        call(stdout);
      }
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
      `/home/${process.env.USER_NAME}/final/sip/data/izpbx/etc/asterisk/sip_custom.conf`,
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
        `/home/${process.env.USER_NAME}/final/sip/data/izpbx/etc/asterisk/sip_custom.conf`,
        "utf8",
        function (error, data) {
          console.log("Асинхронное чтение файла");
          if (error) throw error; // если возникла ошибка
          console.log(data); // выводим считанные данные
        }
      )
      .split("\n\n")
      .filter((item) => item.length);
    const configString = sipUsers.reduce((string, sipUser) => {
      if (sipUser.includes(`[${phoneNumber}]`)) {
        return string;
      } else {
        return string + sipUser + "\n\n";
      }
    }, "");

    fs.writeFileSync(
      `/home/${process.env.USER_NAME}/final/sip/data/izpbx/etc/asterisk/sip_custom.conf`,
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
DELETE FROM used_quota WHERE username="${login}";
DELETE FROM forwardings WHERE address="${login}";
MYSQL_SCRIPT`;
    const lsUsersFiles = `docker exec -i mail_bs ls /var/vmail/vmail1/${domain}/${arrSumbol[0]}/${arrSumbol[1]}/${arrSumbol[2]}`;

    this.doCommandLine(removeFromDB, "mail-bs");
    this.doCommandLine(lsUsersFiles, "mail-bs", (dirs) => {
      const mailDir = dirs.split("\n").find((dir) => {
        return new RegExp(
          `${loginName}-\\d\\d\\d\\d.\\d\\d.\\d\\d.\\d\\d.\\d\\d.\\d\\d`
        ).test(dir);
      });
      const removeUsersFiles = `docker exec -i mail_bs rm -rf /var/vmail/vmail1/${domain}/${arrSumbol[0]}/${arrSumbol[1]}/${arrSumbol[2]}/${mailDir}`;
      this.doCommandLine(removeUsersFiles, "mail-bs");
    });
  }

  async createUser({ login, name, password, number, id }) {
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
    const newUser = new User({ login, name, number, id, status: "registered" });

    await newUser.setPassword(password);
    this.doCommandLine(
      `docker exec -i msg prosodyctl register ${newUser.login.split("@")[0]} ${
        newUser.login.split("@")[1]
      } ${password}`,
      "msg-bs"
    );
    this.doCommandLine(
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
      this.doCommandLine(
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
    const newJWT = await this.signJWT(id, role, process.env.JWT_SECRET);
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
    return users.map(({ id, login, name, number }) => {
      const [loginName, domain] = login.split("@");
      return { id, login: loginName, domain, name, number };
    });
  }

  async getConfig(id, password) {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      return null;
    }
    const [login, domain] = user.login.split("@");
    const config = {
      login,
      password: password,
      ip: global.ALL_IPS,
      domain,
      number: user.number,
    };
    fs.writeFileSync(`${user.id}.json`, JSON.stringify(config), (err) => {
      if (err) throw err;
      console.log("Data has been replaced!");
    });
    return `${user.id}.json`;
  }

  removeConfig(id) {
    fs.unlink(`${id}.json`, (err) => {
      if (err) throw err;
      console.log("Deleted");
    });
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

  async removeUsers(ids) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const { login, number } = await this.userRepository.getUser(ids[i]);
        this.removeSIPUser(number);
        this.doCommandLine(
          `docker exec -i msg prosodyctl deluser ${login}`,
          "msg-bs"
        );
        await this.removeMailUser(login);
        const user = await this.userRepository.remove(ids[i]);
      }
      return "success";
    } catch {
      return null;
    }
  }
}
