import React from 'react';

import Avatar from 'material-ui/Avatar';
import {
  Table as MTable,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {
  Table,
} from 'semantic-ui-react';


class UsersTable extends React.Component {
  state = {
    selected: [],
  };

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('UsersTable render()');
    console.warn('UsersTable render() selected: %o', this.state.selected.slice(0));

    // accounts for 24px padding on table cells for 40x40 img
    const avatarColumnStyles = { width: '88px' };

    const mUserRows = this.props.users.map((user, ndx) =>
      <TableRow key={user.id} selected={this.isSelected(ndx)}>
        <TableRowColumn style={avatarColumnStyles}><Avatar src={user.avatar_url} /></TableRowColumn>
        <TableRowColumn>{`${user.first_name} ${user.last_name}`}</TableRowColumn>
        <TableRowColumn>{user.username}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
      </TableRow>
    );

    const sUserRows = this.props.users.map((user, ndx) =>
      <Table.Row key={user.id} selected={this.isSelected(ndx)}>
        <Table.Cell style={avatarColumnStyles}><Avatar src={user.avatar_url} /></Table.Cell>
        <Table.Cell>{`${user.first_name} ${user.last_name}`}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
      </Table.Row>
    );

    // first column will show avatar, so no header needed
    const mUsersTable = (
      <MTable
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
          {mUserRows}
        </TableBody>
      </MTable>
    );

    return mUsersTable;
  }

  isSelected = (ndx) => {
    return this.state.selected.indexOf(ndx) !== -1;
  }

  handleRowSelect = (rowIndices) => {
    console.log('UsersTable handleRowSelect(%o)', rowIndices)
    const users = (rowIndices === 'all') ? this.props.users : rowIndices.map((rowIndex) => this.props.users[rowIndex]);

    this.setState({
      selected: (rowIndices === 'all') ? Array(users.length).map((val, ndx) => ndx) : rowIndices,
    });

    if (this.props.onSelect) {
      this.props.onSelect(users);
    }
  }
}

export default UsersTable;
