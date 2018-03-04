import React from 'react';

import {
  Table,
} from 'semantic-ui-react';

import CohortOverflow from '../CohortOverflow';

import polymerApi from 'services/polymer-api';


class CohortList extends React.Component {
  state = {
    cohorts: [],
  }

  componentDidMount() {
    this._loadCohorts(this.props.championId)
  }

  componentWillReceiveProps(nextProps) {
    console.warn('CohortList componentWillReceiveProps(%o)', nextProps);
    if (this.props.championId !== nextProps.championId) {
      this._loadCohorts(nextProps.championId);
    }
  }

  render() {
    console.warn('CohortList render()')
    const tableStyles = { marginTop: '2em' };

    const cohorts = this.state.cohorts.map(cohort =>
      <Table.Row key={cohort.id}>
        <Table.Cell>{cohort.name}</Table.Cell>
        <Table.Cell>{cohort.cohort_users_count}</Table.Cell>
        <Table.Cell><CohortOverflow cohort={cohort} /></Table.Cell>
      </Table.Row>
    );


    return (
      <Table style={tableStyles}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Cohort Name</Table.HeaderCell>
            <Table.HeaderCell>User Count</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {cohorts}
        </Table.Body>
      </Table>
    );
  }

  _loadCohorts = (champId) => {
    return polymerApi.get(`champions/${champId}/cohorts`)
      .then((resp) => {
        console.log(resp.content);
        this.setState({ cohorts: resp.content });
      });
  }
}

export default CohortList;
