import createRemoteUser from "../common/create-remote-user.js";
import removeRemoteUser from "../common/remove-remote-user.js";

export class SyncService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async convertRemoteCompare(remoteCompare) {
    const convertedRemoteCompare = {};
    for (let id in remoteCompare) {
      if (remoteCompare[id] === "create") {
        convertedRemoteCompare[id] = await this.userRepository.getUser(id);
        convertedRemoteCompare[id].status = "created";
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

  async syncUpdate(body, remoteIP) {
    let convertedRemoteCompare = body;
    let dataForUpdate = body;
    if (body.remoteCompare) {
      dataForUpdate = body.localCompare;
      convertedRemoteCompare = await this.convertRemoteCompare(
        body.remoteCompare
      );
    }

    for (let id in dataForUpdate) {
      if (dataForUpdate[id] === "remove") {
        try {
          const user = await this.userRepository.getUser(id);
          if (user) {
            removeRemoteUser(id, remoteIP);
            this.userRepository.remove(id);
          }
        } catch {
          return null;
        }
      } else {
        try {
          createRemoteUser(dataForUpdate[id], remoteIP);
          this.userRepository.create(dataForUpdate[id]);
        } catch {
          return null;
        }
      }
    }
    return convertedRemoteCompare;
  }

  async removeUserFromBD(id) {
    try {
      const user = await this.userRepository.getUser(id);
      if (user && user.status == "registered") {
        return await this.userRepository.changeStatus(id, "removed");
      } else if (user) {
        return await this.userRepository.remove(id);
      }
      return null;
    } catch {
      return null;
    }
  }

  async writeUserToBD(newUser) {
    try {
      return await this.userRepository.create(newUser);
    } catch {
      return null;
    }
  }
}
