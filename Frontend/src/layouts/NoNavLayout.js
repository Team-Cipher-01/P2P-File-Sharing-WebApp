import React from "react";
import { Container, Row, Col, NavbarBrand } from "shards-react";

const NoNavLayout = ({ children }) => (
    <Container fluid>
        <Row>
            <Col
                className="main-content p-0"
                
            >
                <NavbarBrand
                    className="w-100 mr-0"
                    href="#"
                    style={{ lineHeight: "25px" }}
                >
                    <div className="d-table m-auto">
                        <img
                            id="main-logo"
                            className="d-inline-block align-top mr-1"
                            style={{ maxWidth: "25px" }}
                            src={require("../images/shards-dashboards-logo.svg")}
                            alt="Shards Dashboard"
                        />

                        <h4 className="d-none d-md-inline ml-1">
                            WebRTC File Share
                        </h4>

                    </div>
                </NavbarBrand>
                {children}
            </Col>
        </Row>
    </Container>
);

export default NoNavLayout;
