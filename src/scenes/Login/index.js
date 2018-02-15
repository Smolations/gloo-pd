import React from 'react';
import {
  Redirect,
} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import Session from '../../services/session';


export default class Login extends React.Component {
  state = {
    redirectToReferrer: false,
  };

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

  render() {
    console.warn('Login render()');
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer || Session.session.isGuest === false) {
      return <Redirect to={from} />;
    }

    const style = {
      width: 300,
      padding: 20,
      margin: '20px auto 20px',
      textAlign: 'center',
    };

    return (
      <Paper style={style}>
        <p>You must log in to view the page at {from.pathname}</p>
        <div>
          <TextField type="text" floatingLabelText="Enter your username or email" id="username" />
        </div>
        <div>
          <TextField type="password" floatingLabelText="Enter your password" id="password" />
        </div>
        <RaisedButton label="Log in" primary={true} onClick={this.login}/>
      </Paper>
    );
  }
}
