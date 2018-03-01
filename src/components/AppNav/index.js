import React from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import NavLoginButton from './components/NavLoginButton';
import NavMenu from './components/NavMenu';

import Session from 'services/session';


class AppNav extends React.Component {
  state = {
    drawerOpen: false,
  };

  render() {
    const headerStyles = {
      padding: '0 16px',
    };

    return (
      <header>
        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={(drawerOpen) => this.setState({ drawerOpen })}
        >
          <h1 style={headerStyles}>Dam Jena</h1>
          <h2 style={headerStyles}>v1.0.0</h2>
          <Divider/>
          <MenuItem onClick={() => this.handleClose('/')}>Home</MenuItem>
          <MenuItem onClick={() => this.handleClose('/cohorts')}>Cohorts</MenuItem>
        </Drawer>
        <AppBar
          title="Dam Jena - Harnessing Growth Energy"
          iconElementRight={Session.session.isGuest === false ? <NavMenu onChampionSelect={this.handleChampionSelect} /> : <NavLoginButton/>}
          onLeftIconButtonClick={this.handleToggle}
        />
      </header>
    );
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleClose = (route) => {
    const { history } = this.props;
    this.setState({ drawerOpen: false });
    history.push(route);
  };

  handleChampionSelect = (champ) => {
    if (this.props.onChampionSelect) {
      this.props.onChampionSelect(champ);
    }
  }
}

export default withRouter(AppNav);
