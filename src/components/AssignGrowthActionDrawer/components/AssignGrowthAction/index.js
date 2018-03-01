/* eslint no-fallthrough:"off" */
import React from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
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


class AssignGrowthAction extends React.Component {
  state = {
    globalDueDate: null,
    toDoTitle: '',
    toDoTitleError: 'You must include a title!',
    toDoDescription: '',

    dataSource: [],
    selectedContent: {},
    searchText: '',

    finished: false,
    stepIndex: 0,
    canProceed: false,

    growthActions: [],
  }

  componentWillMount() {
    console.warn('AssignGrowthAction componentWillMount(%o)', this.props);

    console.log('AssignGrowthAction componentWillMount assignees/growthRelationships: %o/%o', this.props.assignees, this.props.growthRelationships);
    // add a placeholder for all of the growth action information that
    // can/will be configured. the schema matches what the api expects.
    const growthActions = this.props.growthRelationships.map((relationship) => {
      return {
        title: null,
        description: null,
        due_at: null,
        linkable_type: null,
        linkable_id: null,
      };
    })

    this.setState({ growthActions });
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
      </aside>
    );
  }

  handleFinish = () => {
    console.log('AssignGrowthAction handleFinish globalDueDate: %o', this.state.globalDueDate)
    // call api to create growth actions
    // try to save the api call for the very end as resetting it means resetting qa server
    // wait, the outer component should make the call after receiving data via callback, right?
    Promise.all(this.props.growthRelationships.map((relationship, ndx) => {
      const growthAction = this.state.growthActions[ndx];
      const endpoint = `growth_relationships/${relationship.id}/growth_actions`;
      const apiParams = {
        body: {
          growth_action: growthAction,
        },
      };

      growthAction.title = this.state.toDoTitle;
      growthAction.description = this.state.toDoDescription;
      console.log(`POST ${endpoint}  --  %o`, apiParams);

      // make api call(s)
      return polymerApi.post(endpoint, apiParams);
    }))
      .then(() => {
        // call optionally provided callback
        if (this.props.onFinish) {
          this.props.onFinish(this.state.growthActions.slice(0));
        }
      });
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
        const avatarColumnStyles = { width: '40px', padding: '0 5px' };

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
                value={this.state.growthActions[ndx].due_at}
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
    console.log('AssignGrowthAction handleNewActionDueDate() updated growthRelationships: %o', this.state.growthRelationships);
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

  _selectResult = (result) => {
    console.log('AssignGrowthAction _selectResult(%o)', result);
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
    console.log('AssignGrowthAction _updateGrowthActions(%o, %o)', ndx, actionProps);
    // replacing array reference here, but the object references will
    // stay the same. so i think `this.state.growthRelationships[0].foo = true`
    // would persist, but seems like an anti-pattern, no?
    let growthActions = this.state.growthActions.slice(0);
    const updateAction = (originalAction, newAction) => {
      return Object.assign({}, originalAction, newAction);
    };

    if (growthActions[ndx]) {
      growthActions[ndx] = updateAction(growthActions[ndx], actionProps);
    } else {
      growthActions = growthActions.map((growthAction) => updateAction(growthAction, actionProps));
    }
    console.log('AssignGrowthAction _updateGrowthActions() setting state: %o', { growthActions });
    this.setState({ growthActions });
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
      default:
    }
    this.setState({ canProceed: isValid });
    // console.log('_toDoConfigIsValid() returning %o', isValid);
    return isValid;
  }
}

AssignGrowthAction.propTypes = {
  championId: PropTypes.number,
};

export default AssignGrowthAction;
