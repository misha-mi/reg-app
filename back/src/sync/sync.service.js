export class SyncService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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
