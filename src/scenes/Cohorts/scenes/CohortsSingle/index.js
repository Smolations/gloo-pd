import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  Tab,
} from 'semantic-ui-react';

import CohortsSingleView from './scenes/CohortsSingleView';
import CohortsSingleAssignActions from './scenes/CohortsSingleAssignActions';
import CohortsSingleViewActions from './scenes/CohortsSingleViewActions';

import Session from 'services/session';
import polymerApi from 'services/polymer-api';


class CohortsSingle extends React.Component {
  state = {
    cohort: null,
    cohortUsers: [],
    growthRelationships: [],
    shouldRefreshViewActions: false,
  };

  async componentDidMount() {
    console.warn('CohortsSingle componentDidMount');
    const { history, match } = this.props;
    const cohortId = match.params.cohortId;

    const cohortResp = await polymerApi.get(`cohorts/${cohortId}`);

    if (cohortResp.content.champion_id !== this.props.championId) {
      return history.push('/cohorts');
    }

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

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    if (this.props.championId !== nextProps.championId) {
      history.push('/cohorts');
    }
  }

  render() {
    console.warn('CohortsSingle render()');
    const panes = [
      {
        menuItem: 'View Cohort Users',
        render: () => (
          <Tab.Pane>
            <CohortsSingleView cohortUsers={this.state.cohortUsers} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Assign Growth Action',
        render: () => (
          <Tab.Pane>
            <CohortsSingleAssignActions
              cohort={this.state.cohort}
              cohortUsers={this.state.cohortUsers}
              growthRelationships={this.state.growthRelationships}
              onAssignment={() => this.setState({ shouldRefreshViewActions: true })}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'View Growth Actions',
        render: () => (
          <Tab.Pane>
            <CohortsSingleViewActions
              cohortUsers={this.state.cohortUsers}
              growthRelationships={this.state.growthRelationships}
              shouldRefresh={this.state.shouldRefreshViewActions}
              onRefresh={() => this.setState({ shouldRefreshViewActions: false })}
            />
          </Tab.Pane>
        ),
      },
    ]

    return this.state.cohort ?
      (
        <div>
          <p>Current Cohort: {this.state.cohort.name}</p>
          <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
        </div>
      )
      : (
        <p>Loading...</p>
      );
  }
}

CohortsSingle.propTypes = {
  championId: PropTypes.number.isRequired,
};

export default withRouter(CohortsSingle);
