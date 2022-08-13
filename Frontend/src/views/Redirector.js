import React from "react";
import { Redirect } from "react-router-dom";

class Redirector extends React.Component {

    render() {
        return (<Redirect to="/home"></Redirect>)
    }
}

export default Redirector;
