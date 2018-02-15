import React from 'react';
import AppBar from 'material-ui/AppBar';

import NavLoginButton from './components/NavLoginButton';
import NavLogoutButton from './components/NavLogoutButton';

import Session from '../../services/session';


export default class AppNav extends React.Component {
  render() {
    return (
      <AppBar
        title="Dam Jena - Harnessing Growth Energy"
        iconElementRight={Session.session.isGuest === false ? <NavLogoutButton/> : <NavLoginButton/>}
        showMenuIconButton={false}
      />
    );
  }
}
