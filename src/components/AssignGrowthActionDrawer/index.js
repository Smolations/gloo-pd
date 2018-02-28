import React from 'react';
import Drawer from 'material-ui/Drawer';
import AssignGrowthAction from './components/AssignGrowthAction';


export default class AssignGrowthActionDrawer extends React.Component {
  render() {
    console.warn('AssignGrowthActionDrawer render()');
    const assignGrowthActionComponent = (
      <AssignGrowthAction
        assignees={this.props.assignees}
        championId={this.props.championId}
        onFinish={this.props.onFinish}
      />
    );

    return (
      <Drawer
        open={this.props.open}
        docked={false}
        openSecondary={true}
        onRequestChange={this.props.onRequestChange}
        width={500}
      >
        {this.props.open && assignGrowthActionComponent}
      </Drawer>
    );
  }
};
