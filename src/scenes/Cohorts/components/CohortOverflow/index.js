import React from 'react';
import {
  withRouter,
} from 'react-router-dom';

import {
  Button,
  Dropdown,
  Icon,
  Modal,
} from 'semantic-ui-react';

import UsersTable from 'components/UsersTable';

import polymerApi from 'services/polymer-api';


class CohortOverflow extends React.Component {
  state = {
    usersDialogOpen: false,
    growthActionsDialogOpen: false,
    cohortUsers: [],
    cohortUsersLoaded: false,
  };

  render() {
    console.warn('CohortOverflow render()');
    const { history } = this.props;
    const actionsTrigger = (
      <Icon name="ellipsis vertical" />
    );

    return (
      <aside>
        <Dropdown trigger={actionsTrigger} icon={null}>
          <Dropdown.Menu>
            <Dropdown.Item
              disabled={this.props.cohort.cohort_users_count === 0}
              text="View Users"
              onClick={this.handleOpen}
            />
            <Dropdown.Item
              disabled={this.props.cohort.cohort_users_count === 0}
              text="Manage Growth Actions"
              onClick={() => history.push(`/cohorts/${this.props.cohort.id}`)}
            />
          </Dropdown.Menu>
        </Dropdown>

        <Modal open={this.state.usersDialogOpen}>
          <Modal.Header>Users in cohort: {this.props.cohort.name}</Modal.Header>
          <Modal.Content scrolling>
            <UsersTable users={this.state.cohortUsers} />
          </Modal.Content>
          <Modal.Actions>
            <Button primary={true} onClick={this.handleClose}>OK</Button>
          </Modal.Actions>
        </Modal>
      </aside>
    );
  }

  handleOpen = () => {
    const state = {
      usersDialogOpen: true,
    };

    if (!this.state.cohortUsersLoaded) {
      this._loadCohortUsers()
        .then(() => this.setState({ cohortUsersLoaded: true }));
    }

    this.setState(state);
  }

  handleClose = () => {
    this.setState({ usersDialogOpen: false });
  }

  _loadCohortUsers = (cohortId) => {
    return polymerApi.get(`cohorts/${this.props.cohort.id}/users`)
      .then((resp) => {
        console.log('CohortOverflow cohort users: %o', resp);
        return resp.content;
      })
      .then((cohortUsers) => {
        console.warn(cohortUsers);
        this.setState({ cohortUsers });
      })
  }
}

export default withRouter(CohortOverflow);
