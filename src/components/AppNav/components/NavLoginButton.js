import React from 'react';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';


const NavLoginButton = withRouter(
  ({ history }) => {
    console.warn('NavLoginButton render()');
    return (
      <RaisedButton label="Log In" primary={true} onClick={() => history.push("/login")} />
    )
  }
);

export default NavLoginButton;
