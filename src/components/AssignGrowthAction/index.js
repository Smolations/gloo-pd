import React from 'react';
import { withRouter } from 'react-router-dom';

import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';

import polymerApi from 'services/polymer-api';


class AssignGrowthAction extends React.Component {
  state = {
    drawerOpen: false,
    dataSource: [],
  };

  handleClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleSave = () => {
    let cbPromise = {};

    if (this.props.onSave) {
      cbPromise = this.props.onSave({ foo: false });
    }

    // reset values

    // then close
    if (cbPromise.then) {
      cbPromise.then(() => this.handleClose())
    } else {
      this.handleClose();
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
    const styles = {
      header: {
        padding: '1.5em',
      },
      footer: {
        position: 'absolute',
        bottom: 0,
        left:0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
          onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
          width={500}
        >
          <h1 style={styles.header}>Assign Growth Action</h1>

          <Divider/>

          <section>
            <p>Choose content:</p>
            <AutoComplete onUpdateInput={this.handleSearch} />
          </section>

          <footer style={styles.footer}>
            <RaisedButton
              style={styles.footerButtons}
              secondary={true}
              label="Cancel"
              onClick={this.handleClose}
            />
            <RaisedButton
              style={styles.footerButtons}
              primary={true}
              label="Save"
              onClick={this.handleSave}
            />
          </footer>
        </Drawer>
      </aside>
    );
  }

  handleSearch = (searchText, dataSource) => {
    // polymerApi.
  }
}

// export default withRouter(AssignGrowthAction);

export default AssignGrowthAction;
