import SimplePeer from 'simple-peer';

const BUFFER_FULL_THRESHOLD = 65535;

class Peer extends SimplePeer {
  constructor(opts) {
    super(opts);
    this.webRTCPaused = false;
    this.webRTCMessageQueue = [];
  }

  /**
  * This is a wrapper around Send function of Simple Peer.
  * When an attempt is made to transmit a new chunk, the data buffer is checked.
  * If the data buffer is full, the data is held in a local buffer, else it is sent on the data channel.
  * The 'bufferamountlow' event is triggered by SimplePeer internally, if the buffer amount is less than 65535 bytes.
  */
  sendMessageQueued() {
    this.webRTCPaused = false;
    this._channel.bufferedAmountLowThreshold = 65535;
    let message = this.webRTCMessageQueue.shift();

    while (message) {
        console.log("Buffered Amount: ", this._channel.bufferedAmount);
      if (this._channel.bufferedAmount && this._channel.bufferedAmount > BUFFER_FULL_THRESHOLD) {
        this.webRTCPaused = true;
        this.webRTCMessageQueue.unshift(message);

        const listener = () => {
          this._channel.removeEventListener('bufferedamountlow', listener);
          this.sendMessageQueued();
        };

        this._channel.addEventListener('bufferedamountlow', listener);
        return;
      }

      try {
        super.send(message);
        message = this.webRTCMessageQueue.shift();
      } catch (error) {
        throw new Error(`Error send message, reason: ${error.name} - ${error.message}`);
      }
    }
  }

  /**
  * This is a wrapper around Send function of Simple Peer.
  * it triggers sendMessageQueued().
  */
  send(chunk) {
    this.webRTCMessageQueue.push(chunk);

    if (this.webRTCPaused) {
      return;
    }

    this.sendMessageQueued();
  }
};

export default Peer;