import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PrivateRoute from 'components/PrivateRoute';
import CohortsAll from './scenes/CohortsAll';
import CohortsSingle from './scenes/CohortsSingle';


class Cohorts extends React.Component {
  render() {
    console.warn('Cohorts render()');
    const { match } = this.props;

    return this.props.championId ? (
      <section>
        <p>Here you can view a list of your cohorts, filtered by Champion, view individual cohorts, and assign growth actions to cohort users.</p>
        <PrivateRoute exact path={match.url} component={CohortsAll} componentProps={{ championId: this.props.championId }} />
        <PrivateRoute path={`${match.url}/:cohortId`} component={CohortsSingle} componentProps={{ championId: this.props.championId }} />
      </section>
    ) : (
      <p>Loading...</p>
    );
  }
};

Cohorts.propTypes = {
  championId: PropTypes.number.isRequired,
};

export default withRouter(Cohorts);
