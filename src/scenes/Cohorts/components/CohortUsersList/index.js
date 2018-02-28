import React from 'react';

import Avatar from 'material-ui/Avatar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


class CohortUsersList extends React.Component {
  state = {
    users: [],
    selected: [],
  };

  // componentDidMount() {
  //   console.warn('CohortUsersList componentDidMount()');
  //   // no need to check for count now since this component will only
  //   // render when the overflow option is enabled, which is only when
  //   // the users count is greater than zero
  //   polymerApi.get(`cohorts/${this.props.cohortId}/users`)
  //     .then((resp) => {
  //       console.log('CohortUsersList cohort users: %o', resp);
  //       return resp.content;
  //     })
  //     .then((users) => {
  //       console.warn(users);
  //       this.setState({ users });
  //     })
  // }

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('CohortUsersList render()');
    console.warn('CohortUsersList render() selected: %o', this.state.selected.slice(0));

    const avatarColumnStyles = { width: '40px' };
    // const centerColumnStyles = { textAlign: 'center' };

    const userRows = this.props.cohortUsers.map((user, ndx) =>
      <TableRow key={user.id} selected={this.isSelected(ndx)}>
        <TableRowColumn style={avatarColumnStyles}><Avatar src={user.avatar_url} /></TableRowColumn>
        <TableRowColumn>{`${user.first_name} ${user.last_name}`}</TableRowColumn>
        <TableRowColumn>{user.username}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
      </TableRow>
    );

    // first column will show avatar, so no header needed
    return (
      <Table
        onRowSelection={this.handleRowSelect}
        multiSelectable={!!this.props.onSelect}
      >
        <TableHeader
          adjustForCheckbox={!!this.props.onSelect}
          displaySelectAll={!!this.props.onSelect}
        >
          <TableRow>
            <TableHeaderColumn style={avatarColumnStyles}></TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Username</TableHeaderColumn>
            <TableHeaderColumn>Email</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={!!this.props.onSelect} deselectOnClickaway={false}>
          {userRows}
        </TableBody>
      </Table>
    );
  }

  isSelected = (ndx) => {
    return this.state.selected.indexOf(ndx) !== -1;
  }

  handleRowSelect = (rowIndices) => {
    console.log('CohortUsersList handleRowSelect(%o)', rowIndices)
    const users = (rowIndices === 'all') ? this.state.users : rowIndices.map((rowIndex) => this.state.users[rowIndex]);

    this.setState({ selected: (rowIndices === 'all') ? Array(users.length).map((val, ndx) => ndx) : rowIndices }, () => console.log('CohortUsersList selected: %o', this.state.selected));

    if (this.props.onSelect) {
      this.props.onSelect(users);
    }
  }
}

export default CohortUsersList;
