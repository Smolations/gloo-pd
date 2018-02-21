import React from 'react';
// import { withRouter } from 'react-router-dom';

import AutoComplete from 'material-ui/AutoComplete';
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
import TextField from 'material-ui/TextField';

import polymerApi from 'services/polymer-api';


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

    growthActions: [],
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
        return (
          <p>This is where due date config goes...</p>
        );
      default:
        return 'All done! Click the Save button to assign the ToDo!';
    }
  }

  componentWillReceiveProps(nextProps) {
    console.warn('AssignGrowthAction componentWillReceiveProps(%o)', nextProps);
    if (!this.state.drawerOpen && nextProps.open) {
      this.setState({ drawerOpen: true });
    }
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

          {finished || console.log('getting footer buttons...') ? (
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

  handleFinish = () => {
    let cbPromise = {};
    console.log('handleFinish globalDueDate: %o', this.state.globalDueDate)

    // call optionally provided callback
    if (this.props.onFinish) {
      cbPromise = this.props.onFinish({ growthActions: this.state.growthActions });
    }

    // then close (which resets data)
    if (cbPromise.then) {
      cbPromise.then(() => this.handleClose());
    } else {
      this.handleClose();
    }
  }

  handleTitleChange = (event) => {
    console.log('handleTitleChange -> %o', event.target.value);
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
          console.log('search resp: %o', resp)
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
    this.setState({ selectedContent: result }, () => this._toDoConfigIsValid());
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
    console.log('_toDoConfigIsValid() stepIndex=%o toDoTitle="%o" selectedContent=%o', stepIndex, toDoTitle, selectedContent)
    switch (true) {
      case (stepIndex >= 1):
        isValid = isValid && !!selectedContent.id; console.log('stepIndex >= 1, isValid = %o', !!isValid);
      case (stepIndex >= 0):
        isValid = isValid && !!toDoTitle.length; console.log('stepIndex >= 0, isValid = %o', !!isValid);
    }
    this.setState({ canProceed: isValid });
    console.log('_toDoConfigIsValid() returning %o', isValid);
    return isValid;
  }
}


export default AssignGrowthAction;
