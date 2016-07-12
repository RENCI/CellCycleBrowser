var React = require("react");
var PropTypes = React.PropTypes;
var CellLineSelect = require("../components/CellLineSelect");
var UserActionCreators = require("../actions/UserActionCreators");

var CellLineSelectContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string.isRequired,
    cellLines: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeCellLine: function (e) {
    UserActionCreators.selectCellLine(e.target.value);
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
