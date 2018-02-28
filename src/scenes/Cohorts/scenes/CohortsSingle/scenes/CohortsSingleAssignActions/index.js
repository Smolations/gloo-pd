import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

// probs not the best location for this component...
import AssignGrowthActionDrawer from 'components/AssignGrowthActionDrawer';
import UsersTable from 'components/UsersTable';


export default class CohortsSingleAssignActions extends React.Component {
  state = {
    open: false,
    selectedUsers: [],
  };

  componentDidMount() {
    console.warn('CohortsSingleAssignActions componentDidMount');
    // const { match } = this.props;
    // const cohortId = match.params.cohortId;

    // polymerApi.get(`cohorts/${cohortId}`)
    //   .then((resp) => {
    //     console.log('CohortsSingle cohort: %o', resp);
    //     this.setState({ cohort: resp.content });
    //   });
  }

  render() {
    console.warn('CohortsSingleAssignActions render()');
    const assignButtonWrapperStyles = {
      margin: '35px auto',
      textAlign: 'center',
    };

    const getButtonText = () => {
      let txt = 'Assign Growth Action';
      switch (this.state.selectedUsers.length) {
        case 0:
          break;
        case 1:
          txt = `Assign Growth Action to 1 User`;
          break;
        default:
          txt = `Assign Growth Action to ${this.state.selectedUsers.length} Users`;
      }
      return txt;
    }

    return this.props.cohortUsers ?
      (
        <div>
          <div style={assignButtonWrapperStyles}>
            <RaisedButton
              primary={true}
              disabled={!this.state.selectedUsers.length}
              label={getButtonText()}
              onClick={this.handleAssignClick}
            />
          </div>
          <UsersTable
            users={this.props.cohortUsers}
            onSelect={this.handleCohortUsersSelect}
          />
          <div style={assignButtonWrapperStyles}>
            <RaisedButton
              primary={true}
              disabled={!this.state.selectedUsers.length}
              label={getButtonText()}
              onClick={this.handleAssignClick}
            />
          </div>
          <AssignGrowthActionDrawer
            open={this.state.open}
            assignees={this.state.selectedUsers}
            championId={this.props.cohort.champion_id}
            onRequestChange={this.handleDrawerRequestChange}
            onFinish={(growthActions) => {
              console.log('CohortsSingleAssignActions onFinish(%o)', growthActions)
              this.setState({
                open: false,
                selectedUsers: [],
              });
            }}
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
    console.log('CohortsSingleAssignActions handleCohortUsersSelect(%o)', users);
    this.setState({ selectedUsers: users });
  }

  // need this so that clicking away, pressing esc, etc. make sure the
  // drawer remains closed until explicitly opened again
  handleDrawerRequestChange = (open) => {
    this.setState({ open });
  }
};
