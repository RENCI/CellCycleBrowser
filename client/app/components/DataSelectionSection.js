var React = require("react");
var PropTypes = React.PropTypes;
var Workspace = require("../components/Workspace");
var ModelSelectContainer = require("../containers/ModelSelectContainer");
var DatasetSelectContainer = require("../containers/DatasetSelectContainer");
var AnalysisPlotSelectContainer = require("../containers/AnalysisPlotSelectContainer");

var containerStyle = {
  paddingTop: 0,
  paddingBottom: 0
};

var hrStyle = {
  borderColor: "#ddd",
  marginTop: 0,
  marginBottom: 0
};

var selectStyle = {
  marginTop: -1,
  marginBottom: -1
};

function DataSelectionSection(props) {
  return (
    <div className="container-fluid well" style={containerStyle}>
      <div className="row">
        <div className="col-sm-12">
          <Workspace workspace={props.workspace} />
        </div>
      </div>
      <hr style={hrStyle}/>
      <div className="row">
        <div className="col-sm-3 text-center" style={selectStyle}>
          <div style={{display: "inline-block"}}>
            <ModelSelectContainer />
          </div>
          <div style={{display: "inline-block", marginLeft: 10}}>
            <a
              href={'/download/' + props.model.fileName + '/'}>
              <span className="glyphicon glyphicon-download-alt"></span>
            </a>
          </div>
        </div>
        <div className="col-sm-6 text-center" style={selectStyle}>
          <DatasetSelectContainer />
        </div>
        <div className="col-sm-3 text-center" style={selectStyle}>
          <AnalysisPlotSelectContainer />
        </div>
      </div>
    </div>
  );
}

DataSelectionSection.propTypes = {
  workspace: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired
};

module.exports = DataSelectionSection;
