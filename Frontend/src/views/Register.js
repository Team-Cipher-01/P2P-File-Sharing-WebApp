/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
} from "shards-react";

import RegistrationForm from "../components/components-overview/RegistrationForm";

class Register extends React.Component {

    render() {

        return (
            <div>
                <Container fluid className="main-content-container px-4">

                    <Row>
                        <Col lg="4" className="mb-4 mx-auto">

                            {/* Complete Form Example */}
                            <Card small>
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Register</h6>
                                </CardHeader>
                                <RegistrationForm />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Register;
