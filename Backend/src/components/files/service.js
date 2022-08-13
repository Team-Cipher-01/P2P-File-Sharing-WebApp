const Files = require('../../db/models/file.model');

class Service {
  constructor() { }
  async createFile(fileData) {
    try {
      //validate file data and make an entry in the files collection.
      if (!fileData.name || !fileData.user)
        throw new Error("Cannot store file metadata.");
      const file = await Files.create(fileData);
      return file;
    } catch (error) {
      console.error("Error entering file data: ", error);
      throw error;
    }
  }

  async updateFilesInactive(socketId) {
    try {
      //update files state to active: false.
      const file = await Files.updateMany({ "socketId": socketId }, { "$set": { active: false } });
      return file;
    } catch (error) {
      console.error("Error updating inactive data: ", error);
      throw error;
    }
  }

  async updateFilesActive(socketId) {
    try {
      //update files state to active: true.
      const file = await Files.updateMany({ "socketId": socketId }, { "$set": { active: true } });
      return file;
    } catch (error) {
      console.error("Error updating active file data: ", error);
      throw error;
    }
  }
}

module.exports = new Service();