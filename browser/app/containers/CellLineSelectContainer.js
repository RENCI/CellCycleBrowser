var React = require("react");
var PropTypes = React.PropTypes;
var CellLineSelect = require("../components/CellLineSelect");
var CellCycleBrowserActions = require("../actions/CellCycleBrowserActions");

var CellLineSelectContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string.isRequired,
    cellLines: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeCellLine: function (e) {
    CellCycleBrowserActions.changeCellLine({
      cellLine: e.target.value
    });
  },
  render: function () {
    return (
      <CellLineSelect
        label={this.props.label}
        cellLines={this.props.cellLines}
        onChangeCellLine={this.handleChangeCellLine} />
    );
  }
});

module.exports = CellLineSelectContainer;
