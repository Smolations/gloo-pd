import React from 'react';
import PropTypes from 'prop-types';

import CohortList from '../../components/CohortList';


class CohortsAll extends React.Component {
  render() {
    console.warn('CohortsAll render()');
    return (
      <section>
        <CohortList championId={this.props.championId} />
      </section>
    );
  }
};

CohortsAll.propTypes = {
  championId: PropTypes.number.isRequired,
};

export default CohortsAll;
