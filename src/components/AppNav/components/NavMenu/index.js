import React from 'react';
import { withRouter } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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
    const rightIconStyles = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const champMenuItems = this.state.champions.map((champ) => {
      return (
        <MenuItem
          key={champ.id}
          primaryText={champ.name}
          leftIcon={<Avatar src={champ.icon_url} />}
          onClick={() => this.handleChampionSelect(champ)}
        />
      );
    });

    return (
      <div style={rightIconStyles}>
        <Avatar src={this.state.selectedChamp.icon_url} />
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon color="white" /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {champMenuItems}
          <Divider />
          <MenuItem primaryText="Sign Out" onClick={() => {
            return Session.destroy().then(() => history.push("/"));
          }} />
        </IconMenu>
      </div>
    );
  }

  handleChampionSelect = (selectedChamp) => {
    this.setState({ selectedChamp }, () => {
      if (this.props.onChampionSelect) {
        this.props.onChampionSelect(this.state.selectedChamp);
      }
    })
  }
}

export default withRouter(NavMenu);
