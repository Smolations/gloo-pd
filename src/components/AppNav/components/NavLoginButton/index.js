import React from 'react';
import { withRouter } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';


const NavLoginButton = withRouter(
  ({ history }) => {
    // console.warn('NavLoginButton render()');
    return (
      <FlatButton style={{ color: 'white' }} label="Sign In" onClick={() => history.push("/login")} />
    );
  }
);

export default NavLoginButton;
