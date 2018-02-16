import React from 'react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';

import polymerApi from '../../../services/polymer-api';

// need the dialog in CohortOverflow to have access to the list of users
// in a given cohort. in order to have the users fetched for a *single*
// cohort when the dialog is opened, a new component should be created so
// lifecycle hooks can be used.

class CohortUsersList extends React.Component {
  state = {
    users: [],
  };

  componentDidMount() {
    console.warn('CohortUsersList componentDidMount()');
    // no need to check for count now since this component will only
    // render when the overflow option is enabled, which is only when
    // the users count is greater than zero
    polymerApi.get(`cohorts/${this.props.cohort.id}/users`)
      .then((resp) => {
        console.log('CohortUsersList cohort users: %o', resp);
        this.setState({ users: resp.content });
      });
  }

  render() {
    console.warn('CohortUsersList render()');
    const usersListItems = this.state.users.map((user) =>
      <ListItem
        key={user.id}
        primaryText={`${user.first_name} ${user.last_name}`}
        leftAvatar={<Avatar src={user.avatar_url} />}
      />
    );
    const loadingMessage = <ListItem primaryText="Loading..." />

    return (
      <List>
        {usersListItems.length ? usersListItems : loadingMessage}
      </List>
    );
  }
}

export default CohortUsersList;
