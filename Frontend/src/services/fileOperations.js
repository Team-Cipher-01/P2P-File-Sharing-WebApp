/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { Store } from "../flux";
import peerService from "./peerService";

class FileOperations extends React.Component {
    fileChunks = [];
    fileRequested = false;
    simple_peer = null;
    totalChunksReceived = 0;
    totalExpectedChunks = 0;
    downloadProgress = 0;

    /**
    * Receive requested file metadata from Home or Search Page.
    * Find Requested File in Store, and fetch object to transmit.
    */
    processDownloadFile(data) {
        let fileMetadata = data.requestedFile;
        const fileObject = Store.findFile(fileMetadata);
        this.sendFile(fileObject);
    }
    /**
    * Send File Object in chunks, if peer object exists.
    * Send "Done!" at the end of transmission, as a bookmark/indicator to finish transmission.
    */
    sendFile(file) {
        try {
            if (peerService.simple_peer) {
                console.log('Sending', file);

                // We convert the file from Blob to ArrayBuffer
                file.arrayBuffer()
                    .then(buffer => {
                        /**
                         * A chunkSize (in Bytes) is set here
                         * I have it set to 16KB
                         */
                        const chunkSize = 16 * 1024;

                        // Keep chunking, and sending the chunks to the other peer
                        while (buffer.byteLength) {
                            const chunk = buffer.slice(0, chunkSize);
                            buffer = buffer.slice(chunkSize, buffer.byteLength);

                            // Off goes the chunk!
                            peerService.simple_peer.send(chunk);
                        }

                        // End message to signal that all chunks have been sent
                        peerService.simple_peer.send('Done!');
                    });

            }
        } catch (error) {
            console.error("Error while sending file, ", error);
        }
    }
    
    /**
    * Add file chunks to an array, until "Done!" indicator is received.
    * Upon receiving "Done!", the chunks array is written into a file blob and download is triggered.
    */
    receiveFile(data) {
        try {
            if (data.toString() === 'Done!') {
                // Once, all the chunks are received, combine them to form a Blob
                const file = new Blob(this.fileChunks);
                const requestedFileObj = Store.getFileRequested();
                this.fileChunks = [];
                this.fileRequested = false;
                Store.setFileRequested(false);
                console.log('Received', file);
                console.log('Downloading File: ', requestedFileObj.name);
                Store.updateDownloadProgress(100);
                // Download the received file using downloadjs
                this.downloadFile(file, requestedFileObj.name);
            }
            else {
                // Keep appending various file chunks 
                this.fileChunks.push(data);
                this.totalChunksReceived += 1;
                let progressPercentage = ((this.totalChunksReceived / Store.getTotalExpectedChunks()) * 100);
                Store.updateDownloadProgress(progressPercentage);
            }
        } catch (error) {
            console.error("Error in receiveFile, ", error);
        }
    }

    /**
    * Create file URL from File Blob, create a temporary hidden anchor element.
    * Set download attribute to be triggered on click, and perform click function.
    */
    downloadFile(blobObject, fileName) {
        var fileURL = window.URL.createObjectURL(blobObject);
        var tempLink = document.createElement('a');
        tempLink.href = fileURL;
        tempLink.setAttribute('download', fileName);
        tempLink.click();
        this.fileRequested = false;
    }
}

    /**
    * Create a singleton object for FileOperations class.
    * This ensures multiple objects are not created, and none of the data is lost with every new object.
    */

class singletonFileOperations {

    static instance = null;
    static createInstance() {
        var object = new FileOperations();
        return object;
    }

    static getInstance() {
        if (!singletonFileOperations.instance) {
            singletonFileOperations.instance = singletonFileOperations.createInstance();
        }
        return singletonFileOperations.instance;
    }
}

export default singletonFileOperations.getInstance();
