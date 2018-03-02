import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Container,
  Menu,
  Segment,
} from 'semantic-ui-react';

import NavLoginButton from './components/NavLoginButton';
import NavMenu from './components/NavMenu';

import Session from 'services/session';


class AppNav extends React.Component {
  render() {
    const { location } = this.props;
    // const headerStyles = {
    //   padding: '0 16px',
    // };

    const lastMenuItem = (Session.session.isGuest === false)
      ? (
        <Menu.Menu position='right'>
          <NavMenu onChampionSelect={this.handleChampionSelect} />
        </Menu.Menu>
      ) : (
        <Menu.Item position="right">
          <NavLoginButton/>
        </Menu.Item>
      );


    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as="h2">Dam Jena</Menu.Item>
          <Menu.Item
            content="Home"
            as='a'
            active={location.pathname == '/'}
            onClick={() => this.handleNavigation('/')}
          />
          <Menu.Item
            content="Cohorts"
            as='a'
            active={location.pathname.includes('/cohorts')}
            onClick={() => this.handleNavigation('/cohorts')}
          />
          {lastMenuItem}
        </Container>
      </Menu>
    );
  }

  handleNavigation = (route) => {
    const { history } = this.props;
    history.push(route);
  };

  handleChampionSelect = (champ) => {
    if (this.props.onChampionSelect) {
      this.props.onChampionSelect(champ);
    }
  }
}

export default withRouter(AppNav);
