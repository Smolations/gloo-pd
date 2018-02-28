import React from 'react';
import Drawer from 'material-ui/Drawer';
import Snackbar from 'material-ui/Snackbar';
import AssignGrowthAction from './components/AssignGrowthAction';


export default class AssignGrowthActionDrawer extends React.Component {
  state = {
    snackbarOpen: false,
    snackbarMessage: '',
  };

  render() {
    console.warn('AssignGrowthActionDrawer render()');
    const assignGrowthActionComponent = (
      <AssignGrowthAction
        assignees={this.props.assignees}
        growthRelationships={this.props.growthRelationships}
        championId={this.props.championId}
        onFinish={this.onAssignFinish}
      />
    );

    return (
      <aside>
        <Drawer
          open={this.props.open}
          docked={false}
          openSecondary={true}
          onRequestChange={this.props.onRequestChange}
          width={500}
        >
          {this.props.open && assignGrowthActionComponent}
        </Drawer>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={3000}
          onRequestClose={this.handleSnackbarClose}
        />
      </aside>
    );
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
    });
  }

  onAssignFinish = (growthActions) => {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: `Growth action assigned to ${this.props.assignees.length} user${this.props.assignees.length > 1 ? 's' : ''}!`
    }, () => this.props.onFinish(growthActions));
  }
};
