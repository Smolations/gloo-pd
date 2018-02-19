import React from 'react';
import {
  withRouter,
} from 'react-router-dom';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import CohortUsersList from './CohortUsersList';


class CohortOverflow extends React.Component {
  state = {
    usersDialogOpen: false,
    growthActionsDialogOpen: false,
  };

  render() {
    console.warn('CohortList render()');
    const { history } = this.props;
    const usersDialogActions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={() => this.handleClose('users')}
      />,
    ];

    const growthActionsDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose('growthActions')}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.handleClose('growthActions')}
      />,
    ];

    // need the dialog to have access to the list of users in a given cohort.
    // in order to have the users fetched for a *single* cohort when the
    // dialog is opened, a new component should be created so lifecycle
    // hooks can be used.

    return (
      <aside>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <MenuItem
            disabled={this.props.cohort.cohort_users_count === 0}
            primaryText="View Users"
            onClick={() => this.handleOpen('users')}
          />
          <MenuItem
            disabled={this.props.cohort.cohort_users_count === 0}
            primaryText="Assign Growth Action"
            onClick={() => history.push(`/cohorts/${this.props.cohort.id}`)}
          />
        </IconMenu>

        <Dialog
          title={`Users in cohort: ${this.props.cohort.name}`}
          actions={usersDialogActions}
          modal={false}
          open={this.state.usersDialogOpen}
          onRequestClose={() => this.handleClose('users')}
          autoScrollBodyContent={true}
        >
          <CohortUsersList cohort={this.props.cohort} />
        </Dialog>
        <Dialog
          title={`Assign Growth Action to users in ${this.props.cohort.name}`}
          actions={growthActionsDialogActions}
          modal={false}
          open={this.state.growthActionsDialogOpen}
          onRequestClose={() => this.handleClose('growthActions')}
          autoScrollBodyContent={true}
        >
          <CohortUsersList cohort={this.props.cohort.id} />
        </Dialog>
      </aside>
    );
  }

  /**
   *  Handles the opening of all available dialogs using a prefix identifier.
   *  State props should have the format: `<prefixId>DialogOpen`
   *  @param {string} prefixId One of: 'users', 'growthActions'
   */
  handleOpen = (prefixId) => {
    const state = {};
    state[`${prefixId}DialogOpen`] = true;
    this.setState(state);
  };

  /**
   *  Handles the closing of all available dialogs using a prefix identifier.
   *  State props should have the format: `<prefixId>DialogOpen`
   *  @param {string} prefixId One of: 'users', 'growthActions'
   */
  handleClose = (prefixId) => {
    const state = {};
    state[`${prefixId}DialogOpen`] = false;
    this.setState(state);
  };
}

// const CohortOverflow = withRouter(CohortOverflowRouterless);

export default withRouter(CohortOverflow);
