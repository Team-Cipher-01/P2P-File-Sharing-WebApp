/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem,
    Button,
    Alert,
    Progress
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import { Store } from "../flux";
import { Redirect } from "react-router-dom";
import SocketService from "../services/socketService";
import { Constants } from "../flux";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            downloadProgress: 0,
            filesList: [],
            remoteFilesList: [],
            currentRequestedFile: {},
            displayNotification: false,
            lastAddedRemoteFile: null,
            roomEmpty: Store.getRoomEmpty(),
            peerConnectedNotification: Store.getPeerConnectionState(),
        };
        this.socketService = SocketService;
        this.socket = this.socketService.getConnection;
        this.socket.on("message", (message) => this.gotMessageFromServer(message));
        this.onRoomEmptyChange = this.onRoomEmptyChange.bind(this);
        Store.homeVisited();
    }

    componentDidMount() {
        this.onRoomEmptyChange();
        this.fetchFileLists();
        Store.addChangeListener(Constants.ROOM_EMPTY, this.onRoomEmptyChange);
        Store.addChangeListener(Constants.DOWNLOAD_PROGRESS, (downloadProgress) => this.updateDownloadProgress(downloadProgress));
    }

    componentWillUnmount() {
        Store.removeChangeListener(Constants.ROOM_EMPTY, this.onRoomEmptyChange);
        Store.removeChangeListener(Constants.DOWNLOAD_PROGRESS, (downloadProgress) => this.updateDownloadProgress(downloadProgress));
    }

    onRoomEmptyChange() {
        const roomEmpty = Store.getRoomEmpty();
        const peerConnectedNotification = Store.getPeerConnectionState();
            if (peerConnectedNotification) {
                setTimeout(() => {
                    this.setState({ peerConnectedNotification: false });
                }, 10000);
            }
            this.setState({
                ...this.state,
                roomEmpty,
                peerConnectedNotification,
            });
    }

    fetchFileLists() {
        const filesList = Store.getLocalFilesList();
        const remoteFilesList = Store.getRemoteFilesList();
        this.setState({
            ...this.state,
            remoteFilesList,
            filesList,
        });
    }

    updateDownloadProgress(downloadProgress) {
        this.setState({ downloadProgress });
    }

    /**
    * This function listens to all the messages received on the user's socket.
    * @param {*} message 
    */
    gotMessageFromServer = (message) => {
        try {
            if (message.datasender !== Store.getUserId()) {
                switch (message.type) {
                    //executes at original/existing user.
                    case 'new_user_joined': {
                        this.sendFileMetadataToRoom();
                        break;
                    }
                    case 'share_file_list': {
                        this.shareFileList(message.data);
                        break;
                    }
                    default:
                }
            }
        } catch (error) {
            console.error("Error in signalling, ", error);
        }
    }

    //This function displays the notification when a new user joins.
    newUserJoined() {
        this.setState({ userJoinedNotification: true, displayNotification: false, peerConnectedNotification: false });
        setTimeout(() => {
            this.setState({ userJoinedNotification: false });
        }, 10000);
    }

    //This function processes the received file, and displays a 10s notification with file name.
    shareFileList = (data) => {
        let remoteFiles = data.files;
        Store.updateRemoteFileList(data.files);
        let lastAddedRemoteFile = remoteFiles[remoteFiles.length - 1];
        Store.setLastAddedRemoteFile(lastAddedRemoteFile);
        this.setState({ remoteFilesList: remoteFiles, displayNotification: true, lastAddedRemoteFile });
        setTimeout(() => {
            this.setState({ displayNotification: false });
        }, 10000);
    }

    //Triggered when CustomFileUpload component emits new Files to store locally.
    updateFileList = (value) => {
        this.setState({ filesList: value }, () => {
            this.sendFileMetadataToRoom();
        });
    }

    //File uploaded and socket message sent to update files collection.
    updateFileInfo = (value) => {
        let file = {
            name: value.name,
            type: value.type,
            size: value.size,
            user: Store.getUserId()
        };
        this.socketService.send('file_uploaded', { file });
    }

    //This function emits all locally available files to the current room.
    sendFileMetadataToRoom = () => {
        try {
            if (this.state.filesList.length > 0) {
                const fileMetadataList = this.state.filesList.map((element) => {
                    let file = {
                        name: element.name,
                        type: element.type,
                        size: element.size,
                        uploadedBy: Store.getUserId()
                    };
                    return file;
                })
                this.socketService.send('share_file_list', { files: fileMetadataList });
            }
        } catch (error) {
            console.error("Error in signalling, ", error);
        }
    }

    //This function triggers a file download request
    requestFile = (e) => {
        let id = e.target.value;
        const requestedFile = this.state.remoteFilesList[id];
        this.setState({ currentRequestedFile: requestedFile });
        Store.setRequestedFile(requestedFile);
        console.log("Expected Chunks: ", this.totalExpectedChunks);
        this.socketService.send('download_file', { requestedFile });
    }

    render() {

        const { filesList, remoteFilesList, displayNotification, lastAddedRemoteFile, currentRequestedFile, downloadProgress, roomEmpty, userJoinedNotification, peerConnectedNotification } = this.state;
        const isListPopulated = filesList.length ? true : false;

        const isRemoteListPopulated = remoteFilesList.length ? true : false;
        if (!Store.isAuthenticated()) {
            return (<Redirect to="/login"></Redirect>)
        }
        return (
            <div>
                <Container fluid className="px-0">
                    {
                        displayNotification ?
                            (<Alert className="mb-0">
                                <i className="fa fa-info mx-2" />New File Received! <b>{lastAddedRemoteFile.name}</b>
                            </Alert>) : null
                    }
                </Container>
                <Container fluid className="px-0">
                    {
                        userJoinedNotification ?
                            (<Alert className="mb-0">
                                <i className="fa fa-info mx-2" />New User Joined!
                            </Alert>) : null
                    }
                </Container>
                <Container fluid className="px-0">
                    {
                        peerConnectedNotification ?
                            (<Alert className="mb-0">
                                <i className="fa fa-info mx-2" />Peer Connection Established!
                            </Alert>) : null
                    }
                </Container>
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        <PageTitle
                            sm="4"
                            title="Home"
                            className="text-sm-left"
                        />
                    </Row>

                    <Row>

                        <Col lg="4" className="mb-4">

                            <Card small>
                                {/* Files & Dropdowns */}
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Upload File Here</h6>
                                </CardHeader>

                                <ListGroup flush>
                                    <ListGroupItem className="px-3">
                                        <CustomFileUpload disabled={roomEmpty} onFileUpload={this.updateFileList} newUpload={this.updateFileInfo} />
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>

                        <Col lg="4" className="mb-4">

                            <Card small>
                                {/* Progress Bar */}
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Download Progress</h6>
                                </CardHeader>

                                <ListGroup flush>
                                    <ListGroupItem className="px-3">
                                        <strong className="text-muted d-block mb-2">
                                            {(currentRequestedFile && currentRequestedFile.name) ? ((downloadProgress === 100) ? (currentRequestedFile.name + " Downloaded Successfully!") : (currentRequestedFile.name + " Downloading....")) : ("Download not in Progress")}
                                        </strong>
                                        <Progress
                                            theme="success"
                                            style={{ height: "5px" }}
                                            className="mb-3"
                                            value={downloadProgress || 0}
                                        />
                                        {this.downloadProgress &&
                                            <strong className="text-muted d-block mb-2">
                                                {downloadProgress + "%"}
                                            </strong>}
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        <PageTitle
                            sm="4"
                            title="Remote Files"
                            className="text-sm-left"
                        />
                    </Row>
                    {/* Remote Files Table */}

                    <Row>
                        <Col>
                            <Card small className="mb-4">
                                <CardBody className="p-0 pb-3">
                                    <table className="table mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th scope="col" className="border-0">
                                                    #
                                                </th>
                                                <th scope="col" className="border-0">
                                                    File Name
                                                </th>
                                                <th scope="col" className="border-0">
                                                    Uploaded By
                                                </th>
                                                <th scope="col" className="border-0">
                                                    Size
                                                </th>
                                                <th scope="col" className="border-0">
                                                    Download
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isRemoteListPopulated ?
                                                    (remoteFilesList.map((file, idx) => (
                                                        <tr key={idx}>
                                                            <td>{Number(Number(idx) + 1)}</td>
                                                            <td>{file.name}</td>
                                                            <td>{file.uploadedBy}</td>
                                                            <td>{file.size}</td>
                                                            <td><Button key={idx} value={idx} theme="primary" className="mb-2 mr-1" onClick={this.requestFile}>Download</Button></td>
                                                        </tr>
                                                    ))) : (
                                                        <tr>
                                                            <td colSpan={5}>
                                                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                                    <strong className="text-muted d-block mb-2">
                                                                        No remote files exist yet.
                                                                    </strong>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        <PageTitle
                            sm="4"
                            title="Local Files"
                            className="text-sm-left"
                        />
                    </Row>
                    {/* Local Files Table. */}
                    <Row>
                        <Col>
                            <Card small className="mb-4">
                                <CardBody className="p-0 pb-3">
                                    <table className="table mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th scope="col" className="border-0">
                                                    #
                                                </th>
                                                <th scope="col" className="border-0">
                                                    File Name
                                                </th>
                                                <th scope="col" className="border-0">
                                                    Size
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isListPopulated ?
                                                    (filesList.map((file, idx) => (
                                                        <tr key={idx}>
                                                            <td>{Number(Number(idx) + 1)}</td>
                                                            <td>{file.name}</td>
                                                            <td>{file.size}</td>
                                                        </tr>
                                                    ))) : (
                                                        <tr>
                                                            <td colSpan={3}>
                                                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                                    <strong className="text-muted d-block mb-2">
                                                                        No files selected yet.
                                                                    </strong>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Home;
