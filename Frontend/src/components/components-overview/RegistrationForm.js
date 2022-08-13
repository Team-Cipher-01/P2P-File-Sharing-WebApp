import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Button,
  FormFeedback,
  Container,
  Alert
} from "shards-react";
import { Redirect } from "react-router-dom";
import { config } from "../../config";

class RegistrationForm extends React.Component {
  emailValid = null;
  passwordValid = null;
  emailMessage = null;
  passwordMessage = null;
  constructor(props) {
    super(props);

    // reset login status
    localStorage.removeItem('user');

    this.state = {
      email: '',
      password: '',
      submitted: false,
      registerSuccess: false,
      registrationError: false,
      redirectToRegister: false,
      alertMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.routeChange = this.routeChange.bind(this);
  }

  /**
   * This function checks the input and decides whether it is valid.
   * @param {*} e 
   */
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name === 'email') {
      var re = /\S+@\S+\.\S+/;
      if (re.test(value)) {
        this.emailValid = { valid: true };
        this.emailMessage = "The E-mail looks good!";
      } else {
        this.emailValid = { invalid: true };
        this.emailMessage = "The E-mail format is incorrect!";
      }
    }

    if (name === 'password') {
      this.passwordValid = null;
    }

    if (name === 'retypePassword') {
      if (value !== this.state.password) {
        this.passwordValid = { invalid: true };
        this.passwordMessage = "The password does not match!";
      } else {
        this.passwordValid = { valid: true };
        this.passwordMessage = "The passwords match!";
      }
    }

  }

  /**
   * This function makes a user registration request and sends the validated input to the API.
   * Upon successful registration, the user is redirected to the login page.
   * @param {*} e 
   */
  async handleSubmit(e) {
    e.preventDefault();
    try {
      const { email, password } = this.state;
      if (email && password) {
        const response = await fetch(config.apiUrl + 'v1/users/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: email, password: password })
        });
        const result = await response.json();
        if (result.success) {
          this.setState({ registerSuccess: result.success });
          this.setState({ submitted: true });
        } else {
          console.log("Error", result);
          this.setState({registrationError: true, alertMessage: "User is already registered!"});
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
      this.setState({registrationError: true, alertMessage: "Server Error! Try Again Later."});
    }
  }

  routeChange() {
    this.setState({ redirectToRegister: true });
  }

  render() {
    const emailValid = this.emailValid;
    const passwordValid = this.passwordValid;
    const emailMessage = this.emailMessage;
    const passwordMessage = this.passwordMessage;
    if (this.state.registerSuccess) {
      return (
        <Redirect to="/login"></Redirect>
      )
    }
    if (this.state.redirectToRegister) {
      return (
        <Redirect to="/login"></Redirect>
      )
    }
    return (<ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Container fluid className="px-0">
            {
              this.state.registrationError ?
                (<Alert theme="danger" className="mb-0">
                  <i className="fa fa-info mx-2" />{this.state.alertMessage}
                </Alert>) : null
            }
          </Container>
        </Row>
        <Row>
          <Col >
            <Form>
              <Row form>
                <Col md="8" className="form-group mx-auto">
                  <label htmlFor="feEmailAddress">Email</label>
                  <FormInput
                    id="EmailAddress"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onBlur={this.handleChange}
                    {...emailValid}
                  />
                  <FormFeedback valid={(emailValid && emailValid.valid) ? emailValid.valid : false}>{emailMessage}</FormFeedback>
                </Col>
              </Row>
              <Row form>
                <Col md="8" className="form-group mx-auto">
                  <label htmlFor="fePassword">Password</label>
                  <FormInput
                    id="Password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onBlur={this.handleChange}
                    {...passwordValid}
                  />
                  <FormFeedback valid={(passwordValid && passwordValid.valid) ? passwordValid.valid : false}>{passwordMessage}</FormFeedback>
                </Col>
              </Row>
              <Row form>
                <Col md="8" className="form-group mx-auto">
                  <label htmlFor="fePassword">Retype Password</label>
                  <FormInput
                    id="retypePassword"
                    type="password"
                    name="retypePassword"
                    placeholder="Retype your Password"
                    onBlur={this.handleChange}
                    {...passwordValid}
                  />
                  <FormFeedback valid={(passwordValid && passwordValid.valid) ? passwordValid.valid : false}>{passwordMessage}</FormFeedback>
                </Col>
              </Row>
              <Row form>
                <Col md="8" className="form-group mx-auto">
                  <Button disabled={!((passwordValid && passwordValid.valid) && (emailValid && emailValid.valid))} className="btn-block" type="submit" onClick={this.handleSubmit}>Create New Account</Button>
                </Col>
              </Row>
              <Row form>
                <Col md="6" className="form-group mx-auto">
                  <Button className="btn-block btn-outline-primary" onClick={this.routeChange}>Already a User? Login.</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>)
  }
}

export default RegistrationForm;
