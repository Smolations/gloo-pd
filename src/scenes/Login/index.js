import React from 'react';
import {
  Redirect,
} from 'react-router-dom';

import {
  Card,
  Container,
  Form,
} from 'semantic-ui-react';

import Session from 'services/session';


export default class Login extends React.Component {
  state = {
    redirectToReferrer: false,
  };

  render() {
    console.warn('Login render()');
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer || Session.session.isGuest === false) {
      return <Redirect to={from} />;
    }

    // <p>You must log in to view the page at {from.pathname}</p>
    return (
      <Card.Group centered>
        <Card>
          <Card.Content header="Sign In"/>
          <Card.Content>
            <Form onSubmit={this.login}>
              <Form.Field>
                <label>Username or Email</label>
                <input id="username" placeholder='Username or Email' />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input id="password" type="password" placeholder='Password' />
              </Form.Field>
              <Container textAlign="center">
                <Form.Button primary={true} className="center" content="Submit" />
              </Container>
            </Form>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }

  login = () => {
    const identity = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    Session.authUser({ identity, password })
      .catch((err) => {
        console.error('Invalid user/pass!  %o', err);
      })
      .then(() => {
        this.setState({ redirectToReferrer: true });
      });
  };
}
