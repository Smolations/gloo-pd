import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Dropdown,
  Image,
} from 'semantic-ui-react';

import Session from 'services/session';
import polymerApi from 'services/polymer-api';


class NavMenu extends React.Component {
  state = {
    champions: [],
    selectedChamp: {},
  };

  componentDidMount() {
    console.warn('NavMenu componentDidMount()');
    polymerApi.get('memberships/champions')
      .then((resp) => {
        console.log('champs: %o', resp);
        const champions = resp.content;
        this.setState({ champions }, () => this.handleChampionSelect(champions[0]));
      });
  }

  render() {
    console.warn('NavMenu render()');
    const { history } = this.props;
    // const rightIconStyles = {
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };

    const menuTrigger = (
      <Image
        src={this.state.selectedChamp.icon_url}
        size="mini"
        circular
      />
    );

    const champMenuItems = this.state.champions.map((champ) => {
      return (
        <Dropdown.Item
          key={champ.id}
          active={this.state.selectedChamp.id === champ.id}
          onClick={() => this.handleChampionSelect(champ)}
        >
          <Image src={champ.icon_url} avatar />
          <span>{champ.name}</span>
        </Dropdown.Item>
      );
    });

    return (
      <Dropdown item direction="left" icon={menuTrigger}>
        <Dropdown.Menu>
          <Dropdown.Header>Choose Active Champion</Dropdown.Header>
          {champMenuItems}
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  handleChampionSelect = (selectedChamp) => {
    if (this.state.selectedChamp.id !== selectedChamp.id) {
      this.setState({ selectedChamp }, () => {
        if (this.props.onChampionSelect) {
          this.props.onChampionSelect(this.state.selectedChamp);
        }
      });
    }
  }

  handleSignOut = () => {
    return Session.destroy().then(() => history.push("/"));
  }
}

export default withRouter(NavMenu);
