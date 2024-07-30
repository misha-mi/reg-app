export class SyncService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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
    return [{ ...remoteCompare, ...localRCObject }, localCompare];
  }

  async removeUserFromBD(id) {
    try {
      return await this.userRepository.remove(id);
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
