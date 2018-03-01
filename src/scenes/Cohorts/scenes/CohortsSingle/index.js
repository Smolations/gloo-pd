import React from 'react';

import {
  Tab,
  Tabs,
} from 'material-ui/Tabs';

import CohortsSingleView from './scenes/CohortsSingleView';
import CohortsSingleAssignActions from './scenes/CohortsSingleAssignActions';
import CohortsSingleViewActions from './scenes/CohortsSingleViewActions';

import Session from 'services/session';
import polymerApi from 'services/polymer-api';


export default class CohortsSingle extends React.Component {
  state = {
    cohort: null,
    cohortUsers: [],
    growthRelationships: [],
    tabValue: 'a',
    shouldRefreshViewActions: false,
  };

  async componentDidMount() {
    console.warn('CohortsSingle componentDidMount');
    const { match } = this.props;
    const cohortId = match.params.cohortId;

    const cohortResp = await polymerApi.get(`cohorts/${cohortId}`);
    const cohortUsersResp = await polymerApi.get(`cohorts/${cohortId}/users`);

    const growthRelationships = await Promise.all(cohortUsersResp.content.map(async (user, ndx) => {
      const queryParams = new URLSearchParams({
        q: user.username,
      });

      const growthRelationshipsResp = await polymerApi.get(`my/growth_relationships/as_agent?${queryParams}`);
      const relationships = growthRelationshipsResp.content;
      const matchingRelationships = relationships.filter((relationship) =>
        relationship.growee_id === Number(user.id)
      );

      if (matchingRelationships.length) {
        // should only have one element at most after filtering
        return matchingRelationships[0];
      } else {
        // api call to create relationship
        console.log('CohortsSingle componentDidMount creating new growthRelationship...')
        const createRelationshipResp = await polymerApi.post(`growth_relationships`, {
          body: {
            growth_relationship: {
              owner_type: 'Champion',
              owner_id: this.props.championId,
              agent_id: Session.session.user_id,
              growee_id: user.id,
            }
          }
        });

        return createRelationshipResp.content;
      }

      return polymerApi.get(`my/growth_relationships/as_agent?${queryParams}`)
        .then((resp) => resp.content)
        .then((relationships) => {
          const matchingRelationships = relationships.filter((relationship) =>
            relationship.growee_id === Number(user.id)
          );

          if (matchingRelationships.length) {
            return matchingRelationships[0];
          } else {
            // api call to create relationship
            console.log('AssignGrowthAction componentWillMount creating new growthRelationship...')
            return polymerApi.post(`growth_relationships`, {
              body: {
                growth_relationship: {
                  owner_type: 'Champion',
                  owner_id: this.props.championId,
                  agent_id: Session.session.user_id,
                  growee_id: user.id,
                }
              }
            })
            .catch((resp) => {
              console.error(resp);
              throw new Error('Unable to create new growth relationship!')
            })
            .then((resp) => resp.content);
          }
        });
    }));

    console.log('CohortsSingle componentDidMount setting state: %o', {
      cohort: cohortResp.content,
      cohortUsers: cohortUsersResp.content,
      growthRelationships: growthRelationships,
    });

    this.setState({
      cohort: cohortResp.content,
      cohortUsers: cohortUsersResp.content,
      growthRelationships: growthRelationships,
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
              <CohortsSingleAssignActions
                cohort={this.state.cohort}
                cohortUsers={this.state.cohortUsers}
                growthRelationships={this.state.growthRelationships}
                onAssignment={() => this.setState({ shouldRefreshViewActions: true })}
              />
            </Tab>
            <Tab label="View Growth Actions" value="c">
              <CohortsSingleViewActions
                cohortUsers={this.state.cohortUsers}
                growthRelationships={this.state.growthRelationships}
                shouldRefresh={this.state.shouldRefreshViewActions}
                onRefresh={() => this.setState({ shouldRefreshViewActions: false })}
              />
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
