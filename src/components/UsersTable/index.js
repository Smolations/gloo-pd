import React from 'react';

import {
  Image,
  Table,
} from 'semantic-ui-react';

import MultiSelectTable from 'components/MultiSelectTable';


class UsersTable extends React.Component {
  state = {};

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('UsersTable render()');
    // accounts for 24px padding on table cells for 40x40 img
    const avatarColumnStyles = { width: '88px' };

    const tableHeader = (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Username</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );

    const userRows = this.props.users.map((user, ndx) =>
      <Table.Row key={user.id}>
        <Table.Cell><Image circular size="mini" src={user.avatar_url || `https://source.unsplash.com/random/40x40?foo=${user.id}`} /></Table.Cell>
        <Table.Cell>{`${user.first_name} ${user.last_name}`}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
      </Table.Row>
    );

    const tableBody = (
      <Table.Body>
        {userRows}
      </Table.Body>
    );

    const usersTable = !!this.props.onSelect ? (
      <MultiSelectTable onRowSelect={this.handleRowSelect}>
        {tableHeader}
        {tableBody}
      </MultiSelectTable>
    ) : (
      <Table>
        {tableHeader}
        {tableBody}
      </Table>
    );

    return usersTable;
  }

  handleRowSelect = (rowIndices) => {
    console.log('UsersTable handleRowSelect(%o)', rowIndices)
    const users = rowIndices.map((rowIndex) => this.props.users[rowIndex]);

    if (this.props.onSelect) {
      this.props.onSelect(users);
    }
  }
}

export default UsersTable;
