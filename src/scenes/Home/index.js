import React from 'react';
import {
  DateFormat,
  Plural,
  Select,
  SelectOrdinal,
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
    console.warn('Home render()');
    const { i18n } = this.props;
    const name = 'Holmes';
    const gender = 'female';
    const count = 3;
    const emotion = 'love';

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
              <Table.Cell>testing extraction with &lt;Plural/&gt;</Table.Cell>
              <Table.Cell>
                <PluralsTest />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>using &lt;DateFormat/&gt;</Table.Cell>
              <Table.Cell>
                <Trans>Here's a new Date object: <DateFormat value={new Date()}/></Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>extraction with nested components and values</Table.Cell>
              <Table.Cell>
                <Trans>
                  What is it about <a href="https://github.com">GitHub</a>? Do you {emotion} it?
                </Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>extraction with plurals and nested components/values</Table.Cell>
              <Table.Cell>
                <Plural
                  value={count}
                  one="I can think of at least # thing, ${name}"
                  other={<Trans>I can think of at least <strong>#</strong> things, {name}</Trans>}
               />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>extraction with nested components and using i18n.t. also using similar translation with different casing</Table.Cell>
              <Table.Cell>
                <Trans>
                  <Button secondary={true}>Click here</Button> if you want to see nothing <br/>
                  and <a title={i18n.t`Smola's React Professional Development Project`} href="https://github.com/Smolations/gloo-pd">click here</a> to visit
                  this demo's project page.
                </Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>extraction using &lt;Select/&gt;</Table.Cell>
              <Table.Cell>
                <Trans>
                  Have you read
                  <Select
                    value={gender}
                    male="his"
                    female="her"
                    other="their"
                  />
                  book?
                </Trans>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>extraction using &lt;SelectOrdinal/&gt;</Table.Cell>
              <Table.Cell>
                <Trans>
                  I came in
                  <SelectOrdinal
                      value={count}
                      one="#st"
                      two="#nd"
                      few="#rd"
                      other="#th"
                  />
                  place.
                </Trans>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  }
};

export default withI18n()(Home);
