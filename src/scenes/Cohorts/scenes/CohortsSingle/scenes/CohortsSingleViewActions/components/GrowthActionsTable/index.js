import React from 'react';

import {
  Card,
  Container,
  Grid,
  Icon,
  Image,
} from 'semantic-ui-react';

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
          console.log('action: %o', action)
          let dueAt = 'No Due Date';
          let dueAtDate;

          if (action.due_at) {
            dueAtDate = new Date(action.due_at);
            dueAt = `Due ${dueAtDate.getMonth() + 1}.${dueAtDate.getDate()}.${dueAtDate.getFullYear()}`
          }

          return (
            <Card key={action.id}>
              <Image src={action.linkable.banner.src} />
              <Card.Content>
                <Card.Header>{action.title}</Card.Header>
                <Card.Meta>
                  <span>
                    {dueAt}
                  </span>
                </Card.Meta>
                <Card.Description>
                  ({this._getLinkableType(action.linkable_type)}) {action.linkable.title}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                {`${this._getActionStatus(action.status)} / ${this._getActionState(action.state)}`}
              </Card.Content>
            </Card>
          )
        });
      }

      const userBanner = user.banner_url || `https://source.unsplash.com/random/${parseInt(styles.userCard.width,10)}x${parseInt(styles.userCard.width,10)/3.27}?foo=${user.id}`;

      return (
        <Grid.Row key={user.id}>
          <Grid.Column width={3}>
            <Card>
              <Image src={userBanner} />
              <Card.Content>
                <Card.Header>{`${user.first_name} ${user.last_name}`}</Card.Header>
                <Card.Meta>{`@${user.username}`}</Card.Meta>
                <Card.Description>avatar?</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={13}>
            <Container style={styles.actionCardsRoot}>
              {actionCards}
            </Container>
          </Grid.Column>
        </Grid.Row>
      );
    });

    return (
      <Grid columns={2} divided>
        {userRows}
      </Grid>
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
    return classMap[className] || className;
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
          return Promise.all(actions.map((action) => {
            action.linkable = { banner: {} };
            switch (action.linkable_type) {
              case 'Collection':
                return polymerApi.get(`collections/${action.linkable_id}`)
                  .then((resp) => {
                    action.linkable = resp.content;
                    return action;
                  });
                break;
              case 'Tree':
                return polymerApi.get(`trees/${action.linkable_id}`)
                  .then((resp) => {
                    action.linkable = resp.content;
                    return action;
                  });
                break;
              default:
                return action;
            }
          }))
            .then(() => {
              userActionsMap[user.id] = actions;
            });
        });
    }))
      .then(() => {
        console.log('GrowthActionsTable _refreshGrowthActions() setting state: %o', { userActionsMap })
        this.setState({ userActionsMap });
      });
  }
}

export default GrowthActionsTable;
