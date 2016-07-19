var React = require("react");
var PropTypes = React.PropTypes;
var CellLineSelect = require("../components/CellLineSelect");
var UserActionCreators = require("../actions/UserActionCreators");

// Simulate getting cell lines from server
function getCellLines(f) {
  setTimeout(function() {
    var cellLines = JSON.parse(localStorage.getItem("cellLines"));
    f(cellLines);
  }, 0);
}

var CellLineSelectContainer = React.createClass ({
  getInitialState: function () {
    return {
      cellLines: []
    };
  },
  propTypes: {
    label: PropTypes.string.isRequired
  },
  componentDidMount: function () {
    getCellLines(function (cellLines) {
      this.setState({
        cellLines: cellLines
      });

      // Load data for first cell line
      UserActionCreators.selectCellLine(cellLines[0].value);
    }.bind(this));
  },
  handleChangeCellLine: function (e) {
    UserActionCreators.selectCellLine(e.target.value);
  },
  render: function () {
    return (
      <CellLineSelect
        label={this.props.label}
        cellLines={this.state.cellLines}
        onChangeCellLine={this.handleChangeCellLine} />
    );
  }
});

module.exports = CellLineSelectContainer;
