class Channel {
  static BYNARY_TYPE_CHANNEL = "arraybuffer";
  static MAXIMUM_SIZE_DATA_TO_SEND = 65535;
  static BUFFER_THRESHOLD = 65535;
  static LAST_DATA_OF_FILE = "LDOF7";

  #peerConnection = null;
  #channel = null;
  #paused = false;
  #queue = [];
  #channelLabel = "defaultChannel";

  constructor(peerConnection, channelLabel) {
    this.#peerConnection = peerConnection;
    this.#channelLabel = channelLabel;
    this.#channel = this.#peerConnection.createDataChannel(channelLabel);

    this.#channel.binaryType = Channel.BYNARY_TYPE_CHANNEL;
  }

  get channel() {
    return this.#channel;
  }

  get channelLabel() {
    return this.#channelLabel;
  }

  transferFile(fileToShare) {
    this.#channel.onopen = async () => {
      console.log("onopen Peer");
      const arrayBuffer = await fileToShare.arrayBuffer();

      try {
        this.send(
          JSON.stringify({
            totalByte: arrayBuffer.byteLength,
            dataSize: Channel.MAXIMUM_SIZE_DATA_TO_SEND,
          })
        );

        for (
          let index = 0;
          index < arrayBuffer.byteLength;
          index += Channel.MAXIMUM_SIZE_DATA_TO_SEND
        ) {
          this.send(
            arrayBuffer.slice(index, index + Channel.MAXIMUM_SIZE_DATA_TO_SEND)
          );
        }
        this.send(Channel.LAST_DATA_OF_FILE);
      } catch (error) {
        console.error("error sending big file", error);
      }
    };

    return true;
  }

  send(data) {
    this.#queue.push(data);

    if (this.#paused) {
      return;
    }

    this.shiftQueue();
  }

  shiftQueue() {
    this.#paused = false;
    let message = this.#queue.shift();

    while (message) {
      if (
        this.#channel.bufferedAmount &&
        this.#channel.bufferedAmount > Channel.BUFFER_THRESHOLD
      ) {
        this.#paused = true;
        this.#queue.unshift(message);

        const listener = () => {
          this.#channel.removeEventListener("bufferedamountlow", listener);
          this.shiftQueue();
        };

        this.#channel.addEventListener("bufferedamountlow", listener);
        return;
      }

      try {
        this.#channel.send(message);
        message = this.#queue.shift();
      } catch (error) {
        throw new Error(
          `Error to send the next data: ${error.name} ${error.message}`
        );
      }
    }
  }

  onDataChannelCallback = (event) => {
    const { channel } = event;

    let receivedBuffer = [];
    let totalBytesFileBuffer = 0;
    let totalBytesArrayBuffers = 0;

    channel.onmessage = (event) => {
      const { data } = event;

      try {
        if (data.byteLength) {
          receivedBuffer.push(data);
          totalBytesArrayBuffers += data.byteLength;

          if (totalBytesFileBuffer > 0) {
            this.setState({
              progressTransferFile:
                (totalBytesArrayBuffers * 100) / totalBytesFileBuffer,
            });
          }
        } else if (data === Channel.LAST_DATA_OF_FILE) {
          this.getCompleteFile(
            receivedBuffer,
            totalBytesArrayBuffers,
            channel.label
          );
          channel.close();

          receivedBuffer = [];
          totalBytesFileBuffer = 0;
          totalBytesArrayBuffers = 0;
        } else {
          const initMessage = JSON.parse(data);
          totalBytesFileBuffer = initMessage.totalByte || 0;
        }
      } catch (err) {
        receivedBuffer = [];
        totalBytesFileBuffer = 0;
        totalBytesArrayBuffers = 0;
      }
    };
  };


  static getCompleteFile = (
    receivedArrayBuffers,
    totalBytesArrayBuffers,
    fileName
  ) => {
    let offset = 0;
    const uintArrayBuffer = new Uint8Array(totalBytesArrayBuffers, 0);

    receivedArrayBuffers.forEach((arrayBuffer) => {
      uintArrayBuffer.set(
        new Uint8Array(arrayBuffer.buffer || arrayBuffer, arrayBuffer.byteOffset),
        offset
      );
      offset += arrayBuffer.byteLength;
    });

    const blobObject = new Blob([uintArrayBuffer]);

    return this.downloadFile(blobObject, fileName);
  };

  downloadFile(blobObject, fileName) {
    var csvURL = window.URL.createObjectURL(blobObject);
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'filename.csv');
    tempLink.click();
  }
}

export default Channel;
