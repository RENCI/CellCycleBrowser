var React = require("react");
var PropTypes = React.PropTypes;
var Header = require("./Header");
var DataSetSelectContainer = require("../containers/DataSetSelectContainer");
var DataSetDescription = require("../components/DataSetDescription");

function HeaderSection(props) {
  var description = props.dataSet.description ?
                    props.dataSet.description :
                    "";

  return (
    <div className="jumbotron text-center">
      <Header header="Cell Cycle Browser" />
      <DataSetSelectContainer />
      <DataSetDescription description={description} />
    </div>
  );
}

HeaderSection.props = {
  dataSet: PropTypes.object.isRequired
};

module.exports = HeaderSection;
