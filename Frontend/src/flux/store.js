import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import { config } from "../config";
import Webrtc from "../services/webrtc";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  userId: '',
  authenticated: false,
  roomEmpty: true,
  localFilesList: [],
  remoteFilesList: [],
  searchQuery: '',
  requestedFile: null,
  lastAddedRemoteFile: null,
  homeVisited: false,
  peerConnected: false,
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));

    if (config.env === 'dev') {
      _store.userId = Webrtc.createUUID;
      _store.authenticated = true;
    }
  }

  homeVisited() {
    if(!_store.homeVisited) {
      _store.homeVisited = true;
    }
  }

  getHomeVisited() {
    return _store.homeVisited;
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  toggleRoomEmpty() {
    _store.roomEmpty = !_store.roomEmpty;
    this.emit(Constants.ROOM_EMPTY);
  }

  peerConnectionEstablished() {
    _store.peerConnected = true;
  }

  peerConnectionClosed() {
    _store.peerConnected = false;
  }

  getPeerConnectionState() {
    return _store.peerConnected;
  }
 
  updateDownloadProgress(downloadProgress) {
    this.emit(Constants.DOWNLOAD_PROGRESS, downloadProgress);
  }

  updateSocketId(socketId) {
    _store.socketId = socketId;
  }

  addChangeListener(type, callback) {
    this.on(type, callback);
  }

  removeChangeListener(type, callback) {
    this.removeListener(type, callback);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  getRoomEmpty() {
    return _store.roomEmpty;
  }

  setUserId(userId) {
    _store.userId = userId;
    _store.authenticated = true;
  }

  getUserId() {
    return _store.userId;
  }

  isAuthenticated() {
    return _store.authenticated;
  }

  setCurrentSearchQuery(searchQuery) {
    _store.searchQuery = searchQuery;
  }

  fetchSearchQuery() {
    return _store.searchQuery;
  }

  updateFileList(fileList) {
    _store.localFilesList = fileList;
  }

  setRequestedFile(file) {
    _store.requestedFile = file;
    _store.fileRequested = true;
    this.updateDownloadProgress(0);
    _store.totalChunksReceived = 0;
    _store.totalExpectedChunks = Math.ceil(Number(file.size) / (16 * 1024));
    this.emit(Constants.ON_FILE_REQUEST);
  }

  getFileRequested() {
    return _store.requestedFile;
  }

  setFileRequested(fileRequested) {
    _store.fileRequested = fileRequested;
  }

  findFile(fileMetadata) {
    return _store.localFilesList.find(file => file.name === fileMetadata.name);
  }

  getTotalExpectedChunks() {
    return _store.totalExpectedChunks;
  }

  setLastAddedRemoteFile(lastAddedRemoteFile) {
    _store.lastAddedRemoteFile = lastAddedRemoteFile;
  }

  updateRemoteFileList(remoteFilesList) {
    _store.remoteFilesList = remoteFilesList;
  }

  getLastAddedRemoteFile() {
    return _store.lastAddedRemoteFile;
  }

  getRemoteFilesList() {
    return _store.remoteFilesList;
  }

  getLocalFilesList() {
    return _store.localFilesList;
  }

  getSocketId() {
    return _store.socketId;
  }
}

export default new Store();
