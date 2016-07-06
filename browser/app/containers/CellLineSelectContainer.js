var React = require("react");
var PropTypes = React.PropTypes;
var CellLineSelect = require("../components/CellLineSelect");

var CellLineSelectContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string.isRequired,
    cellLines: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  getInitialState: function () {
    return {
      cellLine: ""
    };
  },
  handleChangeCellLine: function (e) {
    e.preventDefault();

    this.setState({
      cellLine: e.target.value
    });
  },
  render: function () {
    console.log(this.state.cellLine);

    return (
      <CellLineSelect
        label={this.props.label}
        cellLines={this.props.cellLines}
        onChangeCellLine={this.handleChangeCellLine} />
    );
  }
});

module.exports = CellLineSelectContainer;
