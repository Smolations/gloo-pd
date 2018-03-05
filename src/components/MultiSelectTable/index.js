import React from 'react';

import {
  Checkbox,
  Table,
} from 'semantic-ui-react';


class MultiSelectTable extends React.Component {
  state = {
    selected: {},
  };

  componentWillMount() {
    // need to get a reference to all rows
    const tableBody = this.props.children[1];
    const selected = {};
    React.Children.forEach(tableBody.props.children, (row) => {
      selected[row.key] = false;
    });
    this.setState({ selected });
  }

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('MultiSelectTable render() props: %o', this.props);
    console.warn('MultiSelectTable render() selected: %o', this.state.selected);
    const newTableHeader = this._getModifiedTableHeader();
    const newTableBody = this._getModifiedTableBody();

    // should also transfer props to table element?
    return (
      <Table>
        {newTableHeader}
        {newTableBody}
      </Table>
    );
  }

  _getModifiedTableBody = () => {
    const tableBody = this.props.children[1];
    if (tableBody) {
      const newRows = React.Children.map(tableBody.props.children, (row) => {
        console.log('row: %o', row);
        const checkboxCell = (
          <Table.Cell key=".00">
            <Checkbox checked={this.state.selected[row.key]} onChange={(e, data) => this.handleRowSelect(data.checked, row.key)} />
          </Table.Cell>
        );
        const newCells = React.Children.map(row.props.children, (cell) => {
          return React.cloneElement(cell);
        });
        newCells.unshift(checkboxCell);
        return React.cloneElement(row, null, newCells);
      });
      const newTableBody = React.cloneElement(tableBody, null, newRows);
      console.log('newTableBody: %o', newTableBody);
      return newTableBody;
    } else {
      // return [];
    }
  }

  _getModifiedTableHeader = () => {
    const selectAllCell = (
      <Table.HeaderCell key=".00">
        <Checkbox onChange={(e, data) => this.handleSelectAll(data.checked)} />
      </Table.HeaderCell>
    );
    const tableHeader = this.props.children[0];
    const tableHeaderRow = tableHeader.props.children;

    if (tableHeader && tableHeaderRow) {
      // insert selectAll cell
      const newHeaderCells = React.Children.map(tableHeaderRow.props.children, (child) => {
        return React.cloneElement(child);
      });
      newHeaderCells.unshift(selectAllCell);

      const newTableHeaderRow = React.cloneElement(tableHeaderRow, null, newHeaderCells);
      const newTableHeader = React.cloneElement(tableHeader, null, newTableHeaderRow);
      console.log('newTableHeader %o', newTableHeader);
      return newTableHeader;
    } else {
      // return [];
    }
  }

  handleSelectAll = (isChecked) => {
    console.log('MultiSelectTable handleSelectAll(%o)', isChecked)
    Object.keys(this.state.selected).forEach(key => {
      this.state.selected[key] = isChecked;
    });
    this.setState({ selected: this.state.selected });
    this._notifyWithSelectedRows();
  }

  handleRowSelect = (isChecked, rowKey) => {
    console.log('MultiSelectTable handleRowSelect(%o, %o)', isChecked, rowKey)
    this.state.selected[rowKey] = isChecked;
    this.setState({ selected: this.state.selected });
    this._notifyWithSelectedRows();
  }

  _notifyWithSelectedRows = () => {
    if (this.props.onRowSelect) {
      const selected = Object.keys(this.state.selected).filter(key => this.state.selected[key]);
      this.props.onRowSelect(selected);
    }
  }
}

export default MultiSelectTable;
