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

import MaterialIcon from 'components/MaterialIcon';

import polymerApi from 'services/polymer-api';

// need the dialog in CohortOverflow to have access to the list of users
// in a given cohort. in order to have the users fetched for a *single*
// cohort when the dialog is opened, a new component should be created so
// lifecycle hooks can be used.

class CohortUsersList extends React.Component {
  state = {
    users: [],
  };

  componentDidMount() {
    console.warn('CohortUsersList componentDidMount()');
    // no need to check for count now since this component will only
    // render when the overflow option is enabled, which is only when
    // the users count is greater than zero
    polymerApi.get(`cohorts/${this.props.cohortId}/users`)
      .then((resp) => {
        console.log('CohortUsersList cohort users: %o', resp);
        return resp.content;
      })
      .then((users) => {
        return Promise.all(users.map((user) => {
          const queryParams = new URLSearchParams({
            q: user.username,
          });

          return polymerApi.get(`my/growth_relationships/as_agent?${queryParams}`)
            .then((resp) => resp.content)
            .then((relationships) => (user.growth_relationships = relationships))
            .then(() => user);
        }))
      })
      .then((users) => {
        console.warn(users);
        this.setState({ users });

        // preselecting all rows via table prop does not call the
        // callback indicating as much. the setState call above MUST
        // come first!
        if (this.props.preSelected) {
          this.handleRowSelect('all');
        }
      })
  }

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('CohortUsersList render()');

    const avatarColumnStyles = { width: '40px' };
    const centerColumnStyles = { textAlign: 'center' };

    const userRows = this.state.users.map(user =>
      <TableRow key={user.id}>
        <TableRowColumn style={avatarColumnStyles}><Avatar src={user.avatar_url} /></TableRowColumn>
        <TableRowColumn>{`${user.first_name} ${user.last_name}`}</TableRowColumn>
        <TableRowColumn>{user.username}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
        {this.props.growthRelationshipStatus && <TableRowColumn style={centerColumnStyles}>{user.growth_relationships.length ? <MaterialIcon name="local_florist" color="green"/> : <MaterialIcon name="local_florist"/>}</TableRowColumn>}
      </TableRow>
    );

    // first column will show avatar, so no header needed
    return (
      <Table
        onRowSelection={this.handleRowSelect}
        multiSelectable={!!this.props.onSelect || this.props.preSelected}
        allRowsSelected={this.props.preSelected}
      >
        <TableHeader
          adjustForCheckbox={!!this.props.onSelect}
          displaySelectAll={!!this.props.onSelect || this.props.preSelected}
        >
          <TableRow>
            <TableHeaderColumn style={avatarColumnStyles}></TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Username</TableHeaderColumn>
            <TableHeaderColumn>Email</TableHeaderColumn>
            {this.props.growthRelationshipStatus && <TableHeaderColumn style={centerColumnStyles}>Growth Relationship Status</TableHeaderColumn>}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={!!this.props.onSelect || this.props.preSelected}>
          {userRows}
        </TableBody>
      </Table>
    );
  }

  handleRowSelect = (rowIndices) => {
    console.log('CohortUsersList handleRowSelect(%o)', rowIndices)
    const users = (rowIndices === 'all') ? this.state.users : rowIndices.map(ndx => this.state.users[ndx]);
    if (this.props.onSelect) {
      this.props.onSelect(users);
    }
  }
}

export default CohortUsersList;
