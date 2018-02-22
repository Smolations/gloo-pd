import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

import polymerApi from 'services/polymer-api';
import Session from 'services/session';


class AssignGrowthAction extends React.Component {
  state = {
    drawerOpen: false,
    dataSource: [],
    toDoTitle: '',
    toDoTitleError: 'You must include a title!',
    toDoDescription: '',
    globalDueDate: null,
    selectedContent: {},
    searchText: '',

    finished: false,
    stepIndex: 0,
    canProceed: false,

    growthRelationships: [],
  }

  // champion id from this.props.championId

  // POST /api/growth_relationships
  // growth_relationship[owner_type]  (required)  Type of owner (allowed values: User, Champion)
  // growth_relationship[owner_id]  (required)  ID of owner
  // growth_relationship[agent_id]  (required)  Growth relationship agent
  // growth_relationship[growee_id]  (required) Growth relationship growee
  componentWillReceiveProps(nextProps) {
    console.warn('AssignGrowthAction componentWillReceiveProps(%o)', nextProps);
    const newState = {};

    if (!this.state.drawerOpen && nextProps.open) {
      newState.drawerOpen = true;
    }

    Promise.all(nextProps.assignees.map((user, ndx) => {
      const queryParams = new URLSearchParams({
        q: user.username,
      });

      let growthRelationship;

      return polymerApi.get(`my/growth_relationships/as_agent?${queryParams}`)
        .then((resp) => resp.content)
        .then((relationships) => {
          const matchingRelationships = relationships.filter((relationship) =>
            relationship.growee_id === Number(user.id)
          );

          if (matchingRelationships.length) {
            return matchingRelationships[0];
          } else {
            // api call to create relationship
            console.log('creating new growthRelationship...')
            return polymerApi.post(`growth_relationships`, {
              body: {
                growth_relationship: {
                  owner_type: 'Champion',
                  owner_id: nextProps.championId,
                  agent_id: Session.session.user_id,
                  growee_id: user.id,
                }
              }
            })
            .catch((resp) => {
              console.error(resp);
              throw new Error('Unable to create new growth relationship!')
            })
            .then((resp) => resp.content);
          }
        });
    }))
    .then((growthRelationships) => {
      console.log('assignees/growthRelationships: %o/%o', this.props.assignees, growthRelationships);
      // add a placeholder for all of the growth action information that
      // can/will be configured. the schema matches what the api expects.
      growthRelationships.map((relationship) => {
        relationship.growth_action = {
          title: null,
          description: null,
          due_at: null,
          linkable_type: null,
          linkable_id: null,
        };
        return relationship;
      })
      newState.growthRelationships = growthRelationships;
    })
    .then(() => this.setState(newState));
  }

  render() {
    console.warn('AssignGrowthAction render()');
    const { finished, stepIndex } = this.state;

    const styles = {
      header: {
        padding: '1.5em',
      },
      body: {
        padding: '0 1.5em',
      },
      footer: {
        position: 'absolute',
        bottom: 0,
        left:0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      },
      footerButtons: {
        margin: '1.5em',
      },
    };

    return (
      <aside>
        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          openSecondary={true}
          onRequestChange={this.handleDrawerRequestChange}
          width={500}
        >
          <header style={styles.header}>
            <h1>Assign Growth Action</h1>
            <p>Progress through the wizard to configure the growth action, or click away to cancel.</p>
          </header>

          <Divider/>

          <section style={styles.body}>
            <Stepper activeStep={stepIndex}>
              <Step>
                <StepLabel>Configure ToDo</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Content</StepLabel>
              </Step>
              <Step>
                <StepLabel>Edit Due Dates</StepLabel>
              </Step>
            </Stepper>

            {finished ? (
              <p>{this.getStepContent(-1)}</p>
            ) : (
              <div>{this.getStepContent(stepIndex)}</div>
            )}
          </section>

          {finished ? (
            <footer style={styles.footer}>
              <RaisedButton
                style={styles.footerButtons}
                primary={true}
                label="Finish"
                onClick={this.handleFinish}
              />
            </footer>
          ) : (
            <footer style={styles.footer}>
              <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
                style={styles.footerButtons}
              />
              <RaisedButton
                label={stepIndex === 2 ? 'Finish' : 'Next'}
                disabled={!this.state.canProceed}
                primary={true}
                onClick={this.handleNext}
                style={styles.footerButtons}
              />
            </footer>
          )}
        </Drawer>
      </aside>
    );
  }

  handleDrawerRequestChange = (drawerOpen) => {
    console.log('handleDrawerRequestChange(%o)', drawerOpen);
    this.setState({ drawerOpen });
    if (!drawerOpen) {
      this._resetState();
    }
  }

  handleClose = () => {
    this.setState({
      drawerOpen: false,
    });
  }

  // POST /api/growth_relationships/:growth_relationship_id/growth_actions
  // growth_action[title]  (required) Growth action title
  // growth_action[description]  (required) Growth action description
  // growth_action[due_at]  Growth action due at
  // growth_action[linkable_type]  Optional type of content to be linked to (allowed values: Tree, Link)
  // growth_action[linkable_id]  Optional id of the linked content. Required if linkable_type is specified.
  handleFinish = () => {
    console.log('handleFinish globalDueDate: %o', this.state.globalDueDate)
    // let cbPromise = Promise.resolve();
    // call api to create growth actions
    // try to save the api call for the very end as resetting it means resetting qa server
    // wait, the outer component should make the call after receiving data via callback, right?
    let cbPromise = Promise.all(this.state.growthRelationships.map((relationship, ndx) => {
      // return polymerApi.post(`growth_relationships/${relationship.id}/growth_actions`, {
      const { growth_action } = relationship;
      growth_action.title = this.state.toDoTitle;
      growth_action.description = this.state.toDoDescription;
      console.log(`POST growth_relationships/${relationship.id}/growth_actions  --  %o`, {
        body: {
          growth_action: growth_action,
        },
      })
    }));


    // call optionally provided callback
    if (this.props.onFinish) {
      cbPromise = cbPromise.then(() =>
        this.props.onFinish(this.state.growthRelationships.slice(0))
      );
    }

    // then close (which resets data)
    cbPromise.then(() => this.handleClose());
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    }, () => this._toDoConfigIsValid());
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 }, () => this._toDoConfigIsValid());
    }
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <TextField
              floatingLabelText="To Do Title"
              value={this.state.toDoTitle}
              onChange={this.handleTitleChange}
              errorText={this.state.toDoTitleError}
            /><br />
            <TextField
              floatingLabelText="To Do Description"
              value={this.state.toDoDescription}
              onChange={this.handleDescriptionChange}
              multiLine={true}
              rows={1}
              rowsMax={5}
            /><br /><br />
            <DatePicker
              mode="landscape"
              minDate={new Date()}
              hintText="Due Date (optional)"
              onChange={this.handleGlobalDueDateChange}
              value={this.state.globalDueDate}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <p>Choose content:</p>
            <AutoComplete
              id="contentSearch"
              onUpdateInput={this.handleSearch}
              dataSource={this.state.dataSource}
              filter={AutoComplete.noFilter}
              fullWidth={true}
              searchText={this.state.searchText}
            />
          </div>
        );
      case 2:
        const avatarColumnStyles = { width: '40px' };
        const centerColumnStyles = { textAlign: 'center' };

        const assigneeRows = this.props.assignees.map((user, ndx) =>
          <TableRow key={user.id} displayBorder={false}>
            <TableRowColumn style={avatarColumnStyles}><Avatar src={user.avatar_url} /></TableRowColumn>
            <TableRowColumn>{`${user.first_name} ${user.last_name}`}</TableRowColumn>
            <TableRowColumn>
              <DatePicker
                mode="landscape"
                defaultDate={this.state.globalDueDate}
                minDate={new Date()}
                hintText="Due Date (optional)"
                onChange={(nil, newDate) => this.handleNewActionDueDate(ndx, newDate)}
                value={this.state.growthRelationships[ndx].growth_action.due_at}
              />
            </TableRowColumn>
          </TableRow>
        );

        return (
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false} style={{border: 'none'}}>
              <TableRow displayBorder={false}>
                <TableHeaderColumn style={avatarColumnStyles}></TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Due Date (optional)</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {assigneeRows}
            </TableBody>
          </Table>
        );
      default:
        // since this is the last step, the growth actions should
        // be created (if they don't already exist; in order to prevent
        // infinite render loop; maybe a use case for using shouldComponentUpdate?)
        return (
          'This should be a summary/confirmation...orrrrr just make sure configuration is complete!'
        );
    }
  }

  handleNewActionDueDate = (ndx, newDate) => {
    this._updateGrowthActions(ndx, { due_at: newDate });
    console.log('handleNewActionDueDate() updated growthRelationships: %o', this.state.growthRelationships);
  }

  handleTitleChange = (event) => {
    // console.log('handleTitleChange -> %o', event.target.value);
    this.setState({
      toDoTitle: event.target.value,
      toDoTitleError: event.target.value.length ? '' : 'You must include a title!',
    }, () => this._toDoConfigIsValid());
  }

  handleDescriptionChange = (event) => {
    this.setState({
      toDoDescription: event.target.value,
    });
  }

  handleGlobalDueDateChange = (nil, newDate) => {
    this._updateGrowthActions(null, { due_at: newDate });
    this.setState({ globalDueDate: newDate });
  }

  handleSearch = (searchText) => {
    const queryParams = new URLSearchParams({
      limit: 10,
      filter: 'collection,tree',
      q: searchText,
    });

    this.setState({ searchText });

    if (searchText.length >= 3 && this.state.selectedContent.name !== searchText) {
      polymerApi.get(`search/autocomplete?${queryParams}`, polymerApi.v1Header)
        .then((resp) => {
          // console.log('search resp: %o', resp)
          this.setState({ dataSource: this._transformResults(resp.results) });
        });
    }
  }

  _resetState = () => {
    this.setState({
      dataSource: [],
      selected: {},
      toDoTitle: '',
      toDoDescription: '',

      finished: false,
      stepIndex: 0,
    });
  }

  _selectResult = (result) => {
    console.log('selectedContent: %o',result);
    this._updateGrowthActions(null, {
      linkable_type: result.class_name,
      linkable_id: result.id,
    });
    this.setState({ selectedContent: result }, () => this._toDoConfigIsValid());
  }

  /**
   *  Quick access to updating growth actions since the state's growthRelationships
   *  are manually composed with a growth_action property object to hold action
   *  information to prep for when the actions are saved.
   *
   *  @param {null|Number} ndx The index of the growth relationship in the state array
   *                           or `null` for all growth relationships. The updated growth
   *                           action will be applied to the selected relationship(s).
   *  @param {object} actionProps The new growth action properties to apply.
   */
  _updateGrowthActions = (ndx, actionProps) => {
    // replacing array reference here, but the object references will
    // stay the same. so i think `this.state.growthRelationships[0].foo = true`
    // would persist, but seems like an anti-pattern, no?
    const growthRelationships = this.state.growthRelationships.slice(0);
    const updateAction = (relationship, action) => {
      relationship.growth_action = Object.assign({}, relationship.growth_action, action);
      return relationship;
    };

    if (growthRelationships[ndx]) {
      growthRelationships[ndx] = updateAction(growthRelationships[ndx], actionProps);
    } else {
      growthRelationships.forEach((relationship) => updateAction(relationship, actionProps));
    }
    this.setState({ growthRelationships });
  }

  _transformResults = (results) => {
    return results.map((result) => {
      return {
        text: result.name,
        value: (
          <MenuItem
            primaryText={result.name}
            secondaryText={result.class_name}
            onClick={() => this._selectResult(result)}
          />
        ),
      }
    })
  }

  _toDoConfigIsValid = () => {
    const { stepIndex, toDoTitle, selectedContent } = this.state;
    let isValid = true;
    // console.log('_toDoConfigIsValid() stepIndex=%o toDoTitle="%o" selectedContent=%o', stepIndex, toDoTitle, selectedContent)
    switch (true) {
      case (stepIndex >= 1):
        isValid = isValid && !!selectedContent.id;
      case (stepIndex >= 0):
        isValid = isValid && !!toDoTitle.length;
    }
    this.setState({ canProceed: isValid });
    // console.log('_toDoConfigIsValid() returning %o', isValid);
    return isValid;
  }
}


export default AssignGrowthAction;
