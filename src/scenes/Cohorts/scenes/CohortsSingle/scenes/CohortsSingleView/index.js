import React from 'react';

import UsersTable from 'components/UsersTable';


export default class CohortsSingleView extends React.Component {
  render() {
    console.warn('CohortsSingleView render()');
    return (
      <UsersTable users={this.props.cohortUsers} />
    );
  }
};
