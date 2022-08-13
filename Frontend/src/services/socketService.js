import React from "react";
import { io } from "socket.io-client";
import { config } from "../config";
import { Store } from "../flux";
import FileOperations from "./fileOperations";
import { default as PeerService } from "./peerService";

class SocketService extends React.Component {
  constructor() {
    super();
    this.socket = null;
    this.socketConnected = false;
    this.roomId = "common-room";
    this.startServerConnection();
  }

  /**
   * This function triggers a new socket connection on Login.
   * All initialization tasks are take care of on the socket hooks.
   */
  async startServerConnection() {
    try {
      const socketIoOptions = {
        ...config.socketIoOptions,
        auth: {
          token: localStorage.getItem("user-access-token")
        },
      }
      this.socket = io(config.socketUrl, socketIoOptions);

      const onOpenCallback = () => {
        Store.updateSocketId(this.socket.id);
        console.log(
          `Socket conection Room id: ${this.roomId} User id: ${Store.getUserId()} now open`
        );
      };

      const onCloseCallback = () => {
        console.log(
          `Close conection Room id: ${this.roomId} User id: ${Store.getUserId()}`
        );
      };

      this.socket.on("connect", onOpenCallback);
      this.socket.on("disconnect", onCloseCallback);
      this.socket.on("message", (message) => { this.gotMessageFromServer(message) });

      return;
    } catch (error) {
      console.error("Error in start connection, ", error);
    }
  }

  /**
   * This function will send the user message and data along with the local user's ID, to the socket server.
   * @param {*} messageType 
   * @param {*} data 
   */
  send(messageType, data) {
    if (this.isOpen) {
      data.sender = Store.getUserId();
      this.socket.emit(messageType, data);
    }
  }

  /**
   * This function listens to all the messages received on the user's socket.
   * @param {*} message 
   */
  gotMessageFromServer(message) {
    try {
      if (message.datasender !== Store.getUserId()) {
        switch (message.type) {
          //executes at original/existing user.
          case 'new_user_joined': {
            PeerService.newUserJoined();
            break;
        }
          //executes at new user
          case 'init_peer': {
            PeerService.initPeer();
            break;
          }
          //executes at original/existing user.
          case 'send_offer': {
            PeerService.sendOffer(message.data);
            break;
          }
          //executes at new user
          case 'send_answer': {
            PeerService.sendAnswer(message.data);
            break;
          }

          case 'download_file': {
            FileOperations.processDownloadFile(message.data);
            break;
          }
          default:
        }
      }
    } catch (error) {
      console.error("Error in signalling, ", error);
    }
  }

  get getConnection() {
    return this.socket;
  }

  get isOpen() {
    return this.socket.connected === true;
  }

  close() {
    if (this.isOpen) {
      this.socket.close();
    }
  }

}

class singletonSocketService {

  static instance = null;
  static createInstance() {
    var object = new SocketService();
    return object;
  }

  static getInstance() {
    if (!singletonSocketService.instance) {
      singletonSocketService.instance = singletonSocketService.createInstance();
    }
    return singletonSocketService.instance;
  }
}

export default singletonSocketService.getInstance();
