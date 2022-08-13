class Webrtc {
    static STATE_CONNECTED = "connected";
    static STATE_CONNECTING = "connecting";
    static STATE_NEW = "new";
    static STATE_FAILED = "failed";
    static STATE_CLOSED = "closed";
    static STATE_DISCONNECTED = "disconnected";
  
    #peerConnections = null;
    #peerConnectionConfig = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.stunprotocol.org:3478" },
      ],
    };
  
    constructor(
      peerConnections,
      peerConnectionConfig = null,
    ) {
      this.#peerConnections = peerConnections;
  
      if (peerConnectionConfig !== null) {
        this.#peerConnectionConfig = peerConnectionConfig;
      }

    }
  
    get peerConnectionConfig() {
      return this.#peerConnectionConfig;
    }
  
    get peerConnections() {
      return this.#peerConnections;
    }
  
    /**
     * @param {{ iceServers: { urls: string; }[]; }} config
     */
    set peerConnectionConfig(config) {
      this.#peerConnectionConfig = config;
      return this;
    }
  
    set peerConnections(peerConnections) {
      this.#peerConnections = peerConnections;
      return this;
    }
  
    static get createUUID() {
      const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
  
      return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
      );
    }
  }
  
  export default Webrtc;
  