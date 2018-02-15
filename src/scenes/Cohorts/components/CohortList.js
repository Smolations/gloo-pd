import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import polymerApi from '../../../services/polymer-api';


class CohortList extends React.Component {
  state = {
    cohorts: [],
  }

  componentWillMount() {
    this._loadCohorts();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.championId !== nextProps.championId) {
      this._loadCohorts(nextProps.championId);
    }
  }

  render() {
    const cohorts = this.state.cohorts.map(cohort =>
      <TableRow key={cohort.id}>
        <TableRowColumn>{cohort.name}</TableRowColumn>
        <TableRowColumn>{cohort.cohort_users_count}</TableRowColumn>
      </TableRow>
    );

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>User Count</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
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
