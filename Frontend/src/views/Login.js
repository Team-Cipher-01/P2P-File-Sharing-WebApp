/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
} from "shards-react";

import LoginForm from "../components/components-overview/LoginForm";

class Login extends React.Component {

    render() {

        return (
            <div>
                <Container fluid className="main-content-container">

                    <Row>
                        <Col lg="4" className="mb-4 mx-auto">

                            {/* Complete Form Example */}
                            <Card small>
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Login</h6>
                                </CardHeader>
                                <LoginForm />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login;
