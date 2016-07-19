var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("../components/Header");
var CellLineSelectContainer = require("../containers/CellLineSelectContainer");

function HeaderSection(props) {
  return (
    <div className="jumbotron text-center">
      <div className="container-fluid">
        <Header header={props.header} />
        <CellLineSelectContainer label="Cell line: " />
      </div>
    </div>
  );
}

HeaderSection.propTypes = {
  header: PropTypes.string.isRequired
},

module.exports = HeaderSection;
