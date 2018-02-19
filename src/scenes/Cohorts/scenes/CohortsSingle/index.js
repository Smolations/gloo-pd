import React from 'react';
// import {
//   withRouter,
// } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';

import AssignGrowthAction from 'components/AssignGrowthAction';
import CohortUsersList from '../../components/CohortUsersList';

import polymerApi from 'services/polymer-api';


export default class CohortsSingle extends React.Component {
  state = {
    cohort: null,
    open: false,
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
            <RaisedButton primary={true} label="Assign Growth Action" onClick={() => {this.setState({ open: true })}}/>
          </div>
          <CohortUsersList cohortId={this.state.cohort.id} growthRelationshipStatus={true} />
          <AssignGrowthAction open={this.state.open} />
        </div>
      )
      : (
        <p>Loading...</p>
      );
  }
}
