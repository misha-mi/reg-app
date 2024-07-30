export class SyncService {
  constructor(logger, userRepository) {
    this.logger = logger;
    this.userRepository = userRepository;
  }

  async convertRemoteCompare(remoteCompare) {
    const convertedRemoteCompare = {};
    for (let id in remoteCompare) {
      if (remoteCompare[id] === "create") {
        convertedRemoteCompare[id] = await this.userRepository.getUser(id);
        convertedRemoteCompare[id].isReg = false;
      } else {
        convertedRemoteCompare[id] = remoteCompare[id];
      }
    }
    return convertedRemoteCompare;
  }

  async generateRCObject(eventsDB) {
    const RCObject = {};
    eventsDB.forEach(({ desc, context }) => {
      const userId = desc.match(/\: ([^}]+)\)/)[1];
      RCObject[userId] = context;
    });
    return RCObject;
  }

  async comparisonRCObject(remoteRCObject, eventsDB) {
    const localRCObject = await this.generateRCObject(eventsDB);
    const localCompare = {};
    const remoteCompare = {};
    for (let id in remoteRCObject) {
      if (remoteRCObject[id] === "remove" && !localRCObject[id]) {
        delete remoteRCObject[id];
      } else if (localRCObject[id] !== remoteRCObject[id]) {
        if (remoteRCObject[id] === "remove" && localRCObject[id] === "create") {
          localCompare[id] = remoteRCObject[id];
          delete remoteRCObject[id];
        } else if (
          localRCObject[id] === "remove" &&
          remoteRCObject[id] === "create"
        ) {
          remoteCompare[id] = localRCObject[id];
        } else {
          localCompare[id] = remoteRCObject[id];
        }
        delete localRCObject[id];
        delete remoteRCObject[id];
      } else {
        delete remoteRCObject[id];
        delete localRCObject[id];
      }
    }

    for (let id in localRCObject) {
      if (localRCObject[id] === "remove") {
        delete localRCObject[id];
      }
    }
    const convertedRemoteCompare = await this.convertRemoteCompare({
      ...remoteCompare,
      ...localRCObject,
    });
    return [convertedRemoteCompare, localCompare];
  }

  async syncUpdate(body) {
    let convertedRemoteCompare = body;
    let dataForUpdate = body;
    if (body.remoteCompare) {
      dataForUpdate = body.localCompare;
      convertedRemoteCompare = await this.convertRemoteCompare(
        body.remoteCompare
      );
    }
    console.log(dataForUpdate);
    for (let id in dataForUpdate) {
      if (dataForUpdate[id] === "remove") {
        try {
          this.removeUserFromBD(id);
        } catch {
          return null;
        }
      } else {
        try {
          this.writeUserToBD(dataForUpdate[id]);
        } catch {
          return null;
        }
      }
    }
    return convertedRemoteCompare;
  }

  async removeUserFromBD(id) {
    try {
      this.logger.log({
        context: "remove",
        desc: `The user has been deleted (sync) (ID: ${id})`,
        isAudit: true,
        ip,
      });
      return await this.userRepository.remove(id);
    } catch {
      return null;
    }
  }

  async writeUserToBD(newUser) {
    try {
      const user = await this.userRepository.create(newUser);
      this.logger.log({
        context: "create",
        desc: `User has been created (sync) (ID: ${newUser.id})`,
        isAudit: true,
        ip,
      });
      return await this.userRepository.create(user);
    } catch {
      return null;
    }
  }
}
