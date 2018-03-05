import React from 'react';

import { Table } from 'semantic-ui-react';
import UsersTable from 'components/UsersTable';
import MultiSelectTable from 'components/MultiSelectTable';


export default class CohortsSingleView extends React.Component {
  state = {};

  render() {
    console.warn('CohortsSingleView render()');
    const rows = this.props.cohortUsers.map((user, ndx) =>
      <Table.Row key={user.id}>
        <Table.Cell>avatar</Table.Cell>
        <Table.Cell>{`${user.first_name} ${user.last_name}`}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
      </Table.Row>
    );

    return (
      <React.Fragment>
        <UsersTable users={this.props.cohortUsers} />
        <MultiSelectTable onRowSelect={this.handleRowSelect}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </MultiSelectTable>
      </React.Fragment>
    );
  }

  handleRowSelect = (...args) => {
    console.warn('CohortsSingleView handleRowSelect(%o)', args);
  }
};
