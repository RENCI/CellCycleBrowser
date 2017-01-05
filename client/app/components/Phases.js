var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var PhaseLineContainer = require("../containers/PhaseLineContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5,
  marginBottom: 10
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var rowStyle = {
  marginLeft: -2,
  marginRight: -2,
  border: "2px solid #ddd",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0
};

var visColumnStyle = {
  paddingLeft: 5,
  paddingRight:0
};

function Phases(props) {
  var collapseId = "phasesCollapse";

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={speciesLabelStyle}>
            {props.name}
          </div>
        </div>
      </div>
      <div>
        <div className="row" style={rowStyle}>
          <div className="col-sm-2 text-left" style={buttonColumnStyle}>
            <CollapseButtonContainer targetId={cellDataCollapseId} />
            <div style={dataLabelStyle}>
              Cell
            </div>
          </div>
          <div className="col-sm-10" style={visColumnStyle}>
            <HeatLineContainer
              data={featureData}
              timeExtent={props.timeExtent}
              alignment={props.alignment} />
          </div>
        </div>
        <div className="row in" id={cellDataCollapseId}>
          <div className="col-sm-10 col-sm-offset-2">
            <HeatMapContainer
              data={featureData}
              timeExtent={props.timeExtent}
              alignment={props.alignment} />
          </div>
        </div>
      </div>
    </div>
  );
}

Species.propTypes = {
  name: PropTypes.string.isRequired,
  cells: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureKey: PropTypes.string.isRequired,
  simulationData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  alignment: PropTypes.string.isRequired
};

module.exports = Species;
