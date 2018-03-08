import React from 'react';

import {
  Header,
} from 'semantic-ui-react';



export default class Home extends React.Component {
  render() {
    console.warn('Home render()');
    return (
      <>
        <Header size="huge" content="Dam Jena" subheader="Harnessing Growth Energy" />
        <p>Looks like you made it!</p>
      </>
    );
  }
};
