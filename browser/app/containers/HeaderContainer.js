var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("../components/Header");
var CellLineSelectContainer = require("./CellLineSelectContainer");

// Dummy information
var cellLines = [
  {value: "cellLine1", name: "Cell line 1"},
  {value: "cellLine2", name: "Cell line 2"}
];

var HeaderContainer = React.createClass ({
  propTypes: {
    header: PropTypes.string.isRequired
  },
  render: function () {
    return (
      <div className="jumbotron col-sm-12 text-center">
        <Header
          header={this.props.header} />
        <CellLineSelectContainer
          label="Cell line: "
          cellLines={cellLines} />
      </div>
    );
  }
});

module.exports = HeaderContainer;
