/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Errors from "./Errors";
import { Redirect } from "react-router-dom";
import { config } from "../config";
import { Store } from "../flux";
import socketService from "../services/socketService";

class Search extends React.Component {

    emptySearchObject = {
        status: 500,
        heading: "No Results Available.",
        message: "No Search Results available for this query."
    };
    searchQuery = "";
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            searchResultsEmpty: true,
            searchApiFailed: false,
            emptySearchObject: {
                status: 500,
                heading: "No Results Available.",
                message: "No Search Results available for this query."
            },
        }
    }
    componentDidMount() {
        this.fetchSearchResults = this.fetchSearchResults.bind(this);
        this.fetchSearchResults();
    }

    componentDidUpdate() {
        if (this.searchQuery !== Store.fetchSearchQuery()) {
            this.fetchSearchResults();
        }
    }

    async fetchSearchResults() {
        try {
            this.searchQuery = Store.fetchSearchQuery();
            if (this.searchQuery && this.searchQuery !== "") {
                console.log("Ready to search");
                const response = await fetch(config.apiUrl + 'v1/search/get-results', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ keyword: this.searchQuery })
                })
                if (!response.ok) {
                    console.error("Search Failed, Server Endpoint is not available.");
                    console.error(response.statusText);
                }
                const result = await response.json();
                if (result.success) {
                    this.setState({ searchResults: result.data, searchResultsEmpty: false });
                    Store.setCurrentSearchQuery("");
                }
            }
        } catch (error) {
            console.error("Fetch Failed. Server is not available.");
            this.setState({
                searchApiFailed: true, searchResultsEmpty: false, emptySearchObject: {
                    status: 500,
                    heading: "No Results Available.",
                    message: "Fetch Failed. Server is not available."
                }
            });
        }
    }

    requestFile = (e) => {
        this.counter = 0;
        let id = e.target.value;
        const requestedFile = this.state.searchResults[id];
        this.setState({ currentRequestedFile: requestedFile });
        Store.setRequestedFile(requestedFile);
        this.fileRequested = true;
        console.log("Expected Chunks: ", this.totalExpectedChunks);
        socketService.send('download_file', { requestedFile });
    }

    render() {

        const { searchResultsEmpty, searchApiFailed, emptySearchObject, searchResults } = this.state;

        const socketId = Store.getSocketId();

        if (!Store.isAuthenticated()) {
            return (<Redirect to="/login"></Redirect>)
        }

        if (searchResultsEmpty || searchApiFailed) {
            return (
                <Errors errorObject={emptySearchObject}></Errors>
            )
        }

        return (
            <Container fluid className="main-content-container px-4">

                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title={"Search Results for '" + this.searchQuery + "'"}
                        subtitle="Results of your search query."
                        className="text-sm-left"
                    />
                </Row>
                {/* Default Light Table */}

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
                                                Uploader Socket Id
                                            </th>
                                            <th scope="col" className="border-0">
                                                Size
                                            </th>
                                            <th scope="col" className="border-0">
                                                Active
                                            </th>
                                            <th scope="col" className="border-0">
                                                Download
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            !searchResultsEmpty &&
                                            (searchResults.map((file, idx) => (
                                                <tr key={idx}>
                                                    <td>{Number(Number(idx) + 1)}</td>
                                                    <td>{file.name}</td>
                                                    <td>{file.user}</td>
                                                    <td>{file.socketId}</td>
                                                    <td>{file.size}</td>
                                                    <td>{String(file.active)}</td>
                                                    <td><Button key={idx} disabled={file.active ? (socketId === file.socketId) : !(file.active)} value={idx} theme="primary" className="mb-2 mr-1" onClick={this.requestFile}>Download</Button></td>
                                                </tr>
                                            )))
                                        }
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Search;
