var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("../components/Header");
var CellLineStore = require("../stores/CellLineStore");
var CellLineSelectContainer = require("./CellLineSelectContainer");

var HeaderContainer = React.createClass ({
  propTypes: {
    header: PropTypes.string.isRequired,
    cellLines: PropTypes.arrayOf(PropTypes.object).isRequired
  },
  render: function () {
    return (
      <div className="jumbotron text-center">
        <div className="container-fluid">
          <Header
            header={this.props.header} />
          <CellLineSelectContainer
            label="Cell line: "
            cellLines={this.props.cellLines} />
          </div>
      </div>
    );
  }
});

module.exports = HeaderContainer;
