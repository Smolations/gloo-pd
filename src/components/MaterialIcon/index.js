import React from 'react';
import FontIcon from 'material-ui/FontIcon';


export default class MaterialIcon extends React.Component {
  render() {
    return (
      <FontIcon className="material-icons" color={this.props.color}>{this.props.name}</FontIcon>
    )
  }
};
