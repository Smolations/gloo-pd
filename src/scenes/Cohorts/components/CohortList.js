import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import CohortOverflow from './CohortOverflow';

import polymerApi from 'services/polymer-api';


class CohortList extends React.Component {
  state = {
    cohorts: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.championId !== nextProps.championId) {
      this._loadCohorts(nextProps.championId);
    }
  }

  render() {
    console.warn('CohortList render()')
    const tableStyles = { marginTop: '2em' };

    const cohorts = this.state.cohorts.map(cohort =>
      <TableRow key={cohort.id}>
        <TableRowColumn>{cohort.name}</TableRowColumn>
        <TableRowColumn>{cohort.cohort_users_count}</TableRowColumn>
        <TableRowColumn><CohortOverflow cohort={cohort} /></TableRowColumn>
      </TableRow>
    );

    return (
      <Table headerStyle={tableStyles}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Cohort Name</TableHeaderColumn>
            <TableHeaderColumn>User Count</TableHeaderColumn>
            <TableHeaderColumn>Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {cohorts}
        </TableBody>
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
