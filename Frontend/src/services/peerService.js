import React from "react";
import { Store } from "../flux";
import { default as SimplePeer } from "../services/peer";
import FileOperations from "./fileOperations";
import { default as SocketService } from "./socketService";

const channelConfig = {
    ordered: true, // guarantee order of transmission
    maxPacketLifeTime: 3000, // in milliseconds
};

class PeerService extends React.Component {
    constructor() {
        super();
        this.simple_peer = null;
        this.answerSent = null;
    }

    /**
     * This function is triggered when a new user is joined.
     * A new simple peer object is created on the local user's browser.
     * The init_peer message is sent to the other user's browser.
     */
    newUserJoined = () => {
        this.simple_peer = new SimplePeer({ channelConfig, trickle: false });
        this.answerSent = false;
        SocketService.send('init_peer', { type: 'init_peer' });
    }

    /**
     * This function is triggered when init_peer message is received at the remote user's browser.
     * The Simple Peer object is created at the remote user's browser.
     * The Simple Peer is created as an initiator, and it triggers a connection by creating an offer immediately.
     * This offer is transmitted to the local user.
     */
    initPeer = () => {
        this.simple_peer = new SimplePeer({ initiator: true, channelConfig, trickle: false });
        this.simple_peer.on('signal', data => {
            if (data.renegotiate || data.transceiverRequest) return
            console.log("Offer Generated: ", data);
            SocketService.send('send_offer', data);
        });
    }

    /**
     * When the offer is received at the local user's browser.
     * The offer is fed into the local user's peer object.
     * The local Simple Peer object, generates an answer.
     * This answer is shared with the remote user.
     */
    sendOffer = (signal) => {
        signal = JSON.stringify(signal)
        this.simple_peer.signal(signal); //consuming offer data

        this.simple_peer.on('signal', data => {
            if (data.renegotiate || data.transceiverRequest) return
            console.log("Answer Generated: ", data);
            if (!this.answerSent) {
                SocketService.send('send_answer', data);
                this.answerSent = true;
            }
        });
        this.onConnect();
    }

    /**
     * The answer is received at the remote user's browser.
     * The answer is consumed by the remote user, and hence a connection is established between the two users.
     */
    sendAnswer = (signal) => {
        signal = JSON.stringify(signal)
        this.simple_peer.signal(signal); //consuming answer data
        this.onConnect();
    }

    onConnect() {
        try {
            //These are the events triggered by the Simple Peer objects internally.
            this.simple_peer.on('connect', () => {
                //Trigger the toggleRoomEmpty() function, this triggers a notification on the Home page.
                Store.toggleRoomEmpty();
                Store.peerConnectionEstablished();
                console.log("peer connected!");
            });
            this.simple_peer.on('data', (data) => {
                //If a user has requested a file, the file data is relayed to receiveFile function and processed further.
                if (Store.getFileRequested())
                    FileOperations.receiveFile(data);
            });
            this.simple_peer.on('close', () => {
                //Triggered to close and clean up connection objects.
                console.log("Close Called.")
                this.closeConnection();
            })
            this.simple_peer.on('error', (error) => {
                //Triggered to close and clean up connection objects in case of errors.
                console.error("Error in Peer", error);
                Store.toggleRoomEmpty();
                this.closeConnection();
            })
        } catch (error) {
            console.error("Error in OnConnect, ", error);
        }
    }

    closeConnection() {
        //Cleanup and reset the local user's browser objects.
        if (this.simple_peer) {
            this.simple_peer.destroy();
            this.answerSent = false;
            this.simple_peer = null;
            Store.toggleRoomEmpty();
            Store.peerConnectionClosed();
        }
    }

}

class singletonPeerService {

    static instance = null;
    static createInstance() {
        var object = new PeerService();
        return object;
    }
  
    static getInstance () {
        if (!singletonPeerService.instance) {
            singletonPeerService.instance = singletonPeerService.createInstance();
        }
        return singletonPeerService.instance;
    }
  }

export default singletonPeerService.getInstance();
