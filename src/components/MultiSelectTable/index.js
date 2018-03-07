import React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Table,
} from 'semantic-ui-react';


class MultiSelectTable extends React.Component {
  // TODO: make this an array or something. fix places where
  // state is getting modified directly...
  state = {
    indices: [],
    selected: [],
  };

  componentWillMount() {
    console.warn('MultiSelectTable componentWillMount()');
    // need to get a reference to all rows
    const tableBody = this._findDirectChild('TableBody');
    let indices = [];

    if (!tableBody) {
      throw new Error('MultiSelectTable requires a Table.Body element!');
    }

    React.Children.forEach(tableBody.props.children, (row, ndx) => {
      indices.push(ndx);
    });
    this.setState({ indices });
  }

  // maybe a table is more appropriate since i just want to show a list
  // of users with no associated actions (aka read-only list)
  render() {
    console.warn('MultiSelectTable render() props: %o', this.props);
    // console.warn('MultiSelectTable render() selected: %o', this.state.selected);
    const newTableHeader = this._getModifiedTableHeader();
    const newTableBody = this._getModifiedTableBody();

    const transferredProps = Object.assign({}, this.props);
    Object.keys(MultiSelectTable.propTypes).forEach((key) => {
      delete transferredProps[key];
    });

    // should also transfer props to table element?
    return (
      <Table {...transferredProps}>
        {newTableHeader}
        {newTableBody}
      </Table>
    );
  }

  _findDirectChild = (type) => {
    let tableChild;
    React.Children.forEach(this.props.children, (child) => {
      if (child.type.name === type) {
        tableChild = child;
      }
    });
    return tableChild;
  }

  _getModifiedTableBody = () => {
    const tableBody = this._findDirectChild('TableBody');
    if (tableBody) {
      const newRows = React.Children.map(tableBody.props.children, (row, ndx) => {
        const isSelected = this.isSelected(ndx);
        // console.log('row[%o]: %o', ndx, row);
        const checkboxCell = (
          <Table.Cell key=".00">
            <Checkbox checked={isSelected} onChange={(e, data) => this.handleRowSelect(data.checked, ndx)} />
          </Table.Cell>
        );
        const newCells = React.Children.map(row.props.children, (cell) => {
          return React.cloneElement(cell);
        });
        newCells.unshift(checkboxCell);
        return React.cloneElement(row, null, newCells);
      });
      const newTableBody = React.cloneElement(tableBody, null, newRows);
      // console.log('newTableBody: %o', newTableBody);
      return newTableBody;
    }
  }

  _getModifiedTableHeader = () => {
    const isChecked = this.state.selected.length === this.state.indices.length;
    const selectAllCell = (
      <Table.HeaderCell key=".00">
        <Checkbox checked={isChecked} onChange={(e, data) => this.handleSelectAll(data.checked)} />
      </Table.HeaderCell>
    );
    const tableHeader = this._findDirectChild('TableHeader');
    const tableHeaderRow = tableHeader.props.children;

    if (tableHeader && tableHeaderRow) {
      // insert selectAll cell
      const newHeaderCells = React.Children.map(tableHeaderRow.props.children, (child) => {
        return React.cloneElement(child);
      });
      newHeaderCells.unshift(selectAllCell);

      const newTableHeaderRow = React.cloneElement(tableHeaderRow, null, newHeaderCells);
      const newTableHeader = React.cloneElement(tableHeader, null, newTableHeaderRow);
      // console.log('newTableHeader %o', newTableHeader);
      return newTableHeader;
    }
  }

  handleSelectAll = (isChecked) => {
    console.log('MultiSelectTable handleSelectAll(%o)', isChecked)
    const selected = isChecked ? this.state.indices.slice(0) : [];
    this.setState({ selected }, () => this._notifyWithSelectedRows());
  }

  handleRowSelect = (isChecked, ndx) => {
    console.log('MultiSelectTable handleRowSelect(%o, %o)', isChecked, ndx)
    let selected = this.state.selected.slice(0);
    if (isChecked) {
      selected.push(ndx);
    } else {
      selected = selected.filter(selectedNdx => selectedNdx !== ndx);
    }
    this.setState({ selected }, () => this._notifyWithSelectedRows());
  }

  isSelected = key => this.state.selected.indexOf(key) !== -1;

  _notifyWithSelectedRows = () => {
    if (this.props.onRowSelect) {
      const selected = this.state.selected.slice(0).sort();
      this.props.onRowSelect(selected);
    }
  }
}

MultiSelectTable.propTypes = {
  onRowSelect: PropTypes.func,
};

export default MultiSelectTable;
