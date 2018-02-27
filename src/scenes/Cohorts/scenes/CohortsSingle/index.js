import React from 'react';

import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import AssignGrowthAction from 'components/AssignGrowthAction';
import CohortUsersList from '../../components/CohortUsersList';

import polymerApi from 'services/polymer-api';


export default class CohortsSingle extends React.Component {
  state = {
    cohort: null,
    open: false,

    selectedUsers: [],

    snackbarOpen: false,
    snackbarMessage: 'You must select at least one user!',
  };

  componentDidMount() {
    console.warn('CohortsSingle componentDidMount');
    const { match } = this.props;
    const cohortId = match.params.cohortId;

    polymerApi.get(`cohorts/${cohortId}`)
      .then((resp) => {
        console.log('CohortsSingle cohort: %o', resp);
        this.setState({ cohort: resp.content });
      });
  }

  render() {
    console.warn('CohortsSingle render()');
    return this.state.cohort ?
      (
        <div>
          <p>Current Cohort: {this.state.cohort.name}</p>
          <div>
            <RaisedButton
              primary={true}
              label="Assign Growth Action"
              onClick={this.handleAssignClick}
            />
          </div>
          <CohortUsersList
            cohortId={this.state.cohort.id}
            onSelect={this.handleCohortUsersSelect}
          />
          <Drawer
            open={this.state.open}
            docked={false}
            openSecondary={true}
            onRequestChange={this.handleDrawerRequestChange}
            width={500}
          >
            <AssignGrowthAction
              assignees={this.state.selectedUsers}
              championId={this.state.cohort.champion_id}
              onFinish={(growthActions) => {
                console.log('CohortsSingle onFinish(%o)', growthActions)
                this.setState({
                  open: false,
                  selectedUsers: [],
                });
              }}
            />
          </Drawer>
          <Snackbar
            bodyStyle={{ backgroundColor: 'red' }}
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            autoHideDuration={10000}
            onRequestClose={this.handleSnackbarClose}
          />
        </div>
      )
      : (
        <p>Loading...</p>
      );
  }

  // make sure at least one user is selected before trying to assign
  // any growth actions
  handleAssignClick = () => {
    if (this.state.selectedUsers.length) {
      this.setState({ open: true })
    } else {
      this.setState({ snackbarOpen: true })
    }
  }

  handleCohortUsersSelect = (users) => {
    console.log('CohortsSingle handleCohortUsersSelect(%o)', users);
    this.setState({ selectedUsers: users });
  }

  // need this so that clicking away, pressing esc, etc. make sure the
  // drawer remains closed until explicitly opened again
  handleDrawerRequestChange = (open) => {
    this.setState({ open });
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  }
}
