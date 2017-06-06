var React = require("react");
var PropTypes = React.PropTypes;
var Workspace = require("../components/Workspace");
var Model = require("../components/Model");
var DatasetSelectContainer = require("../containers/DatasetSelectContainer");
var SummaryPlotSelectContainer = require("../containers/SummaryPlotSelectContainer");

var containerStyle = {
  paddingTop: 0,
  paddingBottom: 0
};

var hrStyle = {
  borderColor: "#ddd",
  marginTop: 0,
  marginBottom: 0
};

function DataSelectionSection(props) {
  return (
    <div className="container-fluid well" style={containerStyle}>
      <div className="row">
        <div className="col-xs-12">
          <Workspace workspace={props.workspace} />
        </div>
      </div>
      <hr style={hrStyle}/>
      <div className="row">
        <div className="col-xs-3 text-center">
          <Model />
        </div>
        <div className="col-xs-6 text-center">
          <DatasetSelectContainer />
        </div>
        <div className="col-xs-3 text-center">
          <SummaryPlotSelectContainer />
        </div>
      </div>
    </div>
  );
}

DataSelectionSection.propTypes = {
  workspace: PropTypes.object.isRequired
};

module.exports = DataSelectionSection;
