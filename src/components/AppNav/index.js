import React from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

// import NavDrawer from './components/NavDrawer';
import NavLoginButton from './components/NavLoginButton';
import NavLogoutButton from './components/NavLogoutButton';

import Session from '../../services/session';


class AppNavRouterless extends React.Component {
  state = { drawerOpen: false };

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleClose = (route) => {
    const { history } = this.props;
    this.setState({ drawerOpen: false });
    history.push(route);
  };

  render() {
    const headerStyles = {
      // padding: '16px',
    };

    return (
      <header>
        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
        >
          <h1 style={headerStyles}>Dam Jena</h1>
          <h2 style={headerStyles}>v1.0.0</h2>
          <Divider/>
          <MenuItem onClick={() => this.handleClose('/')}>Home</MenuItem>
          <MenuItem onClick={() => this.handleClose('/cohorts')}>Cohorts</MenuItem>
        </Drawer>
        <AppBar
          title="Dam Jena - Harnessing Growth Energy"
          iconElementRight={Session.session.isGuest === false ? <NavLogoutButton/> : <NavLoginButton/>}
          onLeftIconButtonClick={this.handleToggle}
        />
      </header>
    );
  }
}

const AppNav = withRouter(AppNavRouterless);

export default AppNav;
