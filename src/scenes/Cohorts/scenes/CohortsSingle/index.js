import React from 'react';

import {
  Tab,
  Tabs,
} from 'material-ui/Tabs';

import CohortsSingleView from './scenes/CohortsSingleView';
import CohortsSingleAssignActions from './scenes/CohortsSingleAssignActions';
import CohortsSingleViewActions from './scenes/CohortsSingleViewActions';

import polymerApi from 'services/polymer-api';


export default class CohortsSingle extends React.Component {
  state = {
    cohort: null,
    cohortUsers: [],
    tabValue: 'a',
  };

  async componentDidMount() {
    console.warn('CohortsSingle componentDidMount');
    const { match } = this.props;
    const cohortId = match.params.cohortId;

    const cohortResp = await polymerApi.get(`cohorts/${cohortId}`);
    const cohortUsersResp = await polymerApi.get(`cohorts/${cohortId}/users`);

    this.setState({
      cohort: cohortResp.content,
      cohortUsers: cohortUsersResp.content,
    });
  }

  render() {
    console.warn('CohortsSingle render()');
    return this.state.cohort ?
      (
        <div>
          <p>Current Cohort: {this.state.cohort.name}</p>
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange}
          >
            <Tab label="View Cohort Users" value="a">
              <CohortsSingleView cohortUsers={this.state.cohortUsers} />
            </Tab>
            <Tab label="Assign Growth Action" value="b">
              <CohortsSingleAssignActions cohort={this.state.cohort} cohortUsers={this.state.cohortUsers} />
            </Tab>
            <Tab label="View Growth Actions" value="c">
              <CohortsSingleViewActions cohortUsers={this.state.cohortUsers} />
            </Tab>
          </Tabs>
        </div>
      )
      : (
        <p>Loading...</p>
      );
  }

  handleTabChange = (tabValue) => {
    this.setState({ tabValue });
  }
}
