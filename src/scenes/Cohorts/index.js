import React from 'react';

import PrivateRoute from 'components/PrivateRoute';
import { CohortsAll, CohortsSingle } from './scenes';



export default class Cohorts extends React.Component {
  render() {
    console.warn('Cohorts render()');
    const { match } = this.props;

    return (
      <section>
        <p>Here you can view a list of your cohorts, filtered by Champion, view individual cohorts, and assign growth actions to cohort users.</p>
        <PrivateRoute exact path={match.url} component={CohortsAll} />
        <PrivateRoute path={`${match.url}/:cohortId`} component={CohortsSingle} />
      </section>
    );
  }
};
