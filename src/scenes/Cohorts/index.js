import React from 'react';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import CohortList from './components/CohortList';

import Session from '../../services/session';
import polymerApi from '../../services/polymer-api';


export default class Cohorts extends React.Component {
  state = {
    champions: [],
    currentChampId: null,
  };

  componentWillMount() {
    polymerApi.get('memberships/champions')
      .then((resp) => {
        console.log('champs: %o', resp);
        const champions = resp.content;
        this.setState({
          champions,
          currentChampId: champions[0].id,
        });
      });
  }

  render() {
    console.warn('Cohorts render()');

    const champMenuItems = this.state.champions.map(champ =>
      <MenuItem key={champ.id} value={champ.id} primaryText={champ.name} />
    );

    return (
      <section>
        <p>Here you can view a list of your cohorts, filtered by Champion.</p>
        <SelectField
          floatingLabelText="Champion"
          value={this.state.currentChampId}
          onChange={this.handleChange}
          autoWidth={true}
        >
          {champMenuItems}
        </SelectField>
        <CohortList championId={this.state.currentChampId} />
      </section>
    );
  }

  handleChange = (event, index, value) => this.setState({ currentChampId: value });
};
