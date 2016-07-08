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
      <div className="jumbotron text-center">
        <div className="container-fluid">
          <Header
            header={this.props.header} />
          <CellLineSelectContainer
            label="Cell line: "
            cellLines={cellLines} />
          </div>
      </div>
    );
  }
});

module.exports = HeaderContainer;
