import React from "react";
import { Container, Button } from "shards-react";

class Errors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                status: 700,
                heading: "Sample Error",
                message: "This is a dummy error."
            }
        };
    }

    componentDidMount() {
        this.setState({ error: this.props.errorObject });
    }

    componentDidUpdate() {
        if ((this.props.errorObject !== this.state.error)) {
            this.setState({ error: this.props.errorObject });
        }
    }

    render() {
        return (<Container fluid className="main-content-container px-4 pb-4">
            <div className="error">
                <div className="error__content">
                    <h2>{this.state.error.status}</h2>
                    <h3>{this.state.error.heading}</h3>
                    <p>{this.state.error.message}</p>
                    <Button pill>&larr; Go Back</Button>
                </div>
            </div>
        </Container>
        )
    }
}

export default Errors;
