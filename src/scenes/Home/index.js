import React from 'react';
import {
  DateFormat,
  Plural,
  Trans,
  withI18n,
} from '@lingui/react';

import {
  Button,
  Header,
  Table,
} from 'semantic-ui-react';


class PluralsTest extends React.Component {
  state = {
    values: [0,1,2],
  };

  render() {
    return (
      <React.Fragment>
        <Button primary={true} onClick={this.handleValueChange}>Cycle value</Button>
        <p>
          <span>(value: {this.state.values[0]})</span>
          &nbsp;&nbsp;
          <Plural
            value={this.state.values[0]}
            _0="There are no problems."
            one="There is # problem."
            other="There are # problems."
          />
        </p>
      </React.Fragment>
    );
  }

  handleValueChange = () => {
    const values = [...this.state.values.slice(1), this.state.values[0]];
    this.setState({ values });
  }
}



class Home extends React.Component {
  render() {
    const { i18n } = this.props;
    console.warn('Home render()');
    return (
      <>
        <Header size="huge" content="Dam Jena" subheader={i18n.t`Harnessing Growth Energy`} />
        <p>Looks like you made it!</p>
        <br/>
        <br/>
        <h2>Let's do some translations:</h2>
        <hr/>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Experiment Type</Table.HeaderCell>
              <Table.HeaderCell>Translation</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>no vars, pluralization, etc. and predefined id</Table.Cell>
              <Table.Cell>
                <Trans id="add_a_member_to_your_organization">default text</Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>using values and predefined id</Table.Cell>
              <Table.Cell>
                <Trans
                  id="remove_user_from_champion"
                  values={{ user: 'Smola', champion: 'Gloo Web' }}
                >
                  default text
                </Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>testing extraction with plurals</Table.Cell>
              <Table.Cell>
                <PluralsTest />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>using DateFormat</Table.Cell>
              <Table.Cell>
                <Trans>Here's a new Date object: <DateFormat value={new Date()}/></Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  }
};

export default withI18n()(Home);
