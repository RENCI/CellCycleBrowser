var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("../components/Header");
var DataSetSelectContainer = require("../containers/DataSetSelectContainer");

function HeaderSection(props) {
  return (
    <div className="jumbotron text-center">
      <div className="container-fluid">
        <Header
          header={props.header} />
        <DataSetSelectContainer
          label="Data set: "
          dataSets={props.dataSets} />
      </div>
    </div>
  );
}

HeaderSection.propTypes = {
  header: PropTypes.string.isRequired,
  dataSets: PropTypes.arrayOf(PropTypes.object).isRequired
},

module.exports = HeaderSection;
