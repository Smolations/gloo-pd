import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Button,
} from 'semantic-ui-react';


const NavLoginButton = withRouter(
  ({ history }) => {
    // console.warn('NavLoginButton render()');
    return (
      <Button secondary={true} onClick={() => history.push("/login")}>Sign In</Button>
    );
  }
);

export default NavLoginButton;
