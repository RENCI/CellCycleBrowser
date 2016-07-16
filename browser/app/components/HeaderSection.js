var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("../components/Header");
var CellLineStore = require("../stores/CellLineStore");
var CellLineSelectContainer = require("../containers/CellLineSelectContainer");

function HeaderSection(props) {
  return (
    <div className="jumbotron text-center">
      <div className="container-fluid">
        <Header
          header={props.header} />
        <CellLineSelectContainer
          label="Cell line: "
          cellLines={props.cellLines} />
        </div>
    </div>
  );
}

HeaderSection.propTypes = {
  header: PropTypes.string.isRequired,
  cellLines: PropTypes.arrayOf(PropTypes.object).isRequired
},

module.exports = HeaderSection;
