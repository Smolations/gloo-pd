import React from 'react';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

import Session from '../../../services/session';

const NavLogoutButton = withRouter(
  ({ history }) => {
    console.warn('NavLogoutButton render()');
    return (
      <RaisedButton label="Log Out" secondary={true} onClick={() => {
        return Session.destroy().then(() => history.push("/"));
      }}/>
    )
  }
);

export default NavLogoutButton;
