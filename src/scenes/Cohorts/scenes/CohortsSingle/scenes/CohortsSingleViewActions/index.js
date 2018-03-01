import React from 'react';

import GrowthActionsTable from './components/GrowthActionsTable';

// this.props.shouldRefresh
// this.props.onRefresh
export default class CohortsSingleViewActions extends React.Component {
  state = {};

  render() {
    console.warn('CohortsSingleViewActions render()');
    return (
      <GrowthActionsTable
        users={this.props.cohortUsers}
        growthRelationships={this.props.growthRelationships}
        shouldRefresh={this.props.shouldRefresh}
        onRefresh={this.props.onRefresh}
      />
    );
  }
};
