import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Button
} from "shards-react";
import { Redirect } from "react-router-dom";
import { config } from "../../config";
import store from "../../flux/store";

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    // reset login status
    localStorage.removeItem('user');

    this.state = {
      email: '',
      password: '',
      submitted: false,
      loginSuccess: false,
      redirectToRegister: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  /**
   * This is the login function, triggered after the login form is filled.
   * This function validates the input data, and makes a request to the login API.
   * If the user login is valid, the API returns a user token, and redirects the user to the home page.
   * */
  async handleSubmit(e) {
    e.preventDefault();
    try {
      const { email, password } = this.state;
      if (email && password) {
        const response = await fetch(config.apiUrl + 'v1/users/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: email, password: password })
        });
        const result = await response.json();
        if (result.success) {
          localStorage.setItem("user-access-token", result.userToken)
          store.setUserId(email);
          this.setState({ loginSuccess: result.success });
          this.setState({ submitted: true });
        } else {
          console.log("Error", result);
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  }

  routeChange() {
    this.setState({ redirectToRegister: true });
  }

  render() {
    if (this.state.loginSuccess) {
      return (
        <Redirect to="/home"></Redirect>
      )
    }
    if (this.state.redirectToRegister) {
      return (
        <Redirect to="/register"></Redirect>
      )
    }
    return (
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  <Col md="6" className="form-group mx-auto">
                    <label htmlFor="EmailAddress">Email</label>
                    <FormInput
                      id="EmailAddress"
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={this.handleChange}
                    />
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group mx-auto">
                    <label htmlFor="Password">Password</label>
                    <FormInput
                      id="Password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={this.handleChange}
                    />
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group mx-auto">
                    <Button className="btn-block" type="submit" onClick={this.handleSubmit}>Login</Button>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group mx-auto">
                    <Button className="btn-block btn-outline-primary" onClick={this.routeChange}>Register</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    );
  }
}

export default LoginForm;
