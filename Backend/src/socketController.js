const { Server } = require('socket.io');
const Auth = require('./middlewares/auth');
const { Service: FileService } = require('./components/files');

module.exports = (app) => {
  const io = new Server(app, {
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // eslint-disable-next-line no-console
  console.info('Socketio initialized!');

  //Check authentication on the socket connection step.
  io.use(async (socket, next) => {
    try {
      if (socket.handshake.auth.token) {
        const token = socket.handshake.auth.token;
        const headers = { 'access-token': token };
        await Auth.socketAuthorize(socket, headers);
        next();
      } else {
        next();
      }
    } catch (error) {
      console.error("Socket Connect Failed: ", error);
      next(new Error("Socket Connect Failed."));
    }
  });

  const event = io.of('/');

  /**
   * Setup different listeners on the socket connection step, to relay messages between users in the room.
   */
  event.on('connection', async (socket) => {
    console.info('Socket connected!', socket.id);
    //This step updates all inactive files related to this socketId as active.
    await FileService.updateFilesActive(socket.id);
    socket.join("common-room");
    socket.to("common-room").emit('message', {
      type: "new_user_joined",
    });

    socket.on("init_peer", (data) => {
      console.log("Init Peer: ", data);
      setTimeout(() => {
        socket.to("common-room").emit('message', { type: 'init_peer', data });
      }, 3000);
    });

    socket.on("send_offer", (data) => {
      console.log("Send Offer: ", data);
      setTimeout(() => {
        socket.to("common-room").emit('message', { type: 'send_offer', data });
      }, 3000);
    });

    socket.on("send_answer", (data) => {
      console.log("Send Answer: ", data);
      setTimeout(() => {
        socket.to("common-room").emit('message', { type: 'send_answer', data });
      }, 3000);
    });

    //This listener makes an entry into the Files Collection, is the file details are valid.
    socket.on("file_uploaded", async (data) => {
      const file = data.file;
      console.log("file_uploaded: ", file);
      if (file.user) {
        file.active = "true";
        file.socketId = socket.id;
        await FileService.createFile(file);
      }
    });

    socket.on("share_file_list", (data) => {
      console.log("share_file_list: ", data);
      socket.to("common-room").emit('message', { type: 'share_file_list', data });
    });

    socket.on("download_file", (data) => {
      console.log("download_file: ", data);
      socket.to("common-room").emit('message', { type: 'download_file', data });
    });

    //Update all active files in this socket session as inactive, when the socket disconnect occurs.
    socket.on("disconnect", async () => {
      console.log("Socket Disconnected: ", socket.id);
      await FileService.updateFilesInactive(socket.id);
    });

    //Update all active files in this socket session as inactive, when any socket error occurs.
    socket.on("error", async () => {
      console.log("Socket Errored: ", socket.id);
      await FileService.updateFilesInactive(socket.id);
    });

  });
  return io;
};
