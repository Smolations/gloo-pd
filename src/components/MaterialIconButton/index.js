import React from 'react';
import IconButton from 'material-ui/IconButton';
import MaterialIcon from '../MaterialIcon';


export default class MaterialIconButton extends React.Component {
  render() {
    return (
      <IconButton>
        <MaterialIcon name={this.props.name} color={this.props.color}/>
      </IconButton>
    );
  }
};
