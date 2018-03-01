import React from 'react';

import Avatar from 'material-ui/Avatar';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import {
  GridList,
  GridTile,
} from 'material-ui/GridList';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import polymerApi from 'services/polymer-api';


class GrowthActionsTable extends React.Component {
  state = {
    userActionsMap: {},
  };

  componentDidMount() {
    console.warn('GrowthActionsTable componentDidMount()');
    this._refreshGrowthActions();
  }

  componentWillReceiveProps(nextProps) {
    console.warn('GrowthActionsTable componentWillReceiveProps(%o)', nextProps);
    if (nextProps.shouldRefresh) {
      console.log('refreshing and calling callback...')
      this._refreshGrowthActions().then(() => {
        this.props.onRefresh();
      });
    } else {
      console.log('no need to refresh');
    }
  }

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('GrowthActionsTable render()');
    const styles = {
      actionTable: {
        marginTop: '20px',
      },
      userCardColumn: {
        width: '250px',
        padding: '10px 5px',
      },
      userCard: {
        width: '250px',
      },
      actionCardsColumn: {
        padding: '10px 0',
      },
      actionCardsRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
      actionCard: {
        width: '300px',
        margin: '0 10px',
      },
    };

    const userRows = this.props.users.map((user, ndx) => {
      let actionCards = [];

      if (this.state.userActionsMap[user.id]) {
        actionCards = this.state.userActionsMap[user.id].map((action) => {
          let dueAt = 'No Due Date';
          let dueAtDate;

          if (action.due_at) {
            dueAtDate = new Date(action.due_at);
            dueAt = `Due ${dueAtDate.getMonth() + 1}.${dueAtDate.getDate()}.${dueAtDate.getFullYear()}`
          }

          return (
            <Card key={action.id} style={styles.actionCard}>
              <CardMedia
                overlay={<CardTitle title="Content title" subtitle={this._getLinkableType(action.linkable_type)} />}
              >
                <img src="http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg" alt="" />
              </CardMedia>
              <CardTitle title={action.title} subtitle={dueAt} />
              <CardText>
                {`${this._getActionStatus(action.status)} / ${this._getActionState(action.state)}`}
              </CardText>
            </Card>
          );
        });
      }

      return (
        <TableRow key={user.id} displayBorder={false}>
          <TableRowColumn style={styles.userCardColumn}>
            <Card style={styles.userCard}>
              <CardHeader
                title={`${user.first_name} ${user.last_name}`}
                subtitle={`@${user.username}`}
                avatar={user.avatar_url || 'https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif'}
              />
            </Card>
          </TableRowColumn>
          <TableRowColumn style={styles.actionCardsColumn}>
            <div style={styles.actionCardsRoot}>
              {actionCards}
            </div>
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table multiSelectable={false} style={styles.actionTable}>
        <TableBody displayRowCheckbox={false}>
          {userRows}
        </TableBody>
      </Table>
    );
  }

  // const GROWTH_ACTION_PROGRESS_STATUSES = {
  //   COMPLETED: 'completed',
  //   URGENT: 'urgent',
  //   WARNING: 'warning',
  //   NEUTRAL: 'neutral',
  //   NOTICE: 'notice',
  // };

  _getActionState = (state) => {
    const stateMap = {
      not_started: 'Not Started',
      started: 'Started',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return stateMap[state];
  }

  _getActionStatus = (status) => {
    const statusMap = {
      unobserved: 'Unobserved',
      unread: 'Unread',
      read: 'Read',
    };
    return statusMap[status];
  }

  _getLinkableType = (className) => {
    const classMap = {
      Tree: 'Program',
      Collection: 'Collection',
    };
    return classMap[className];
  }

  _refreshGrowthActions = () => {
    const userActionsMap = {};

    return Promise.all(this.props.growthRelationships.map((relationship, ndx) => {
      const endpoint = `growth_relationships/${relationship.id}/growth_actions`;

      return polymerApi.get(endpoint)
        .then(resp => resp.content)
        .then((actions) => {
          const user = this.props.users[ndx];
          // console.log('setting actions map for user:  %o => %o',user, actions);
          userActionsMap[user.id] = actions;
        });
    }))
      .then(() => {
        console.log('GrowthActionsTable _refreshGrowthActions() setting state: %o', { userActionsMap })
        this.setState({ userActionsMap });
      });
  }
}

export default GrowthActionsTable;
