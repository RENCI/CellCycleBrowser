var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var PhaseLineContainer = require("../containers/PhaseLineContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5,
  marginTop: 10,
  marginBottom: 10
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10
};

var nameStyle = {
  fontWeight: "bold"
};

var sourceStyle = {
  marginRight: 10,
  float: "right"
};

var rowStyle = {
  marginLeft: -1,
  marginRight: -1,
  border: "1px solid #ccc",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5,
  marginBottom: -1
};

var buttonColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0
};

var visColumnStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

var collapseRowStyle = {
  marginTop: 1,
  marginLeft: -1,
  marginRight: -1,
  borderLeft: "1px solid #ccc",
  borderRight: "1px solid #ccc"
};

var collapseColStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

function Phases(props) {
  if (props.phases.length === 0) {
    return null;
  }

  var collapseId = "phasesCollapse";

  var averageHeight = 32;
  var trackHeight = 20;

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-xs-12">
          <div style={labelStyle}>
            <span style={nameStyle}>Phases</span>
            <span style={sourceStyle}>Simulation</span>
          </div>
        </div>
      </div>
      <div>
        <div className="row" style={rowStyle}>
          <div className="col-xs-2 text-left" style={buttonColumnStyle}>
            <CollapseButtonContainer targetId={collapseId} />
          </div>
          <div className="col-xs-10" style={visColumnStyle}>
            <PhaseMapContainer
              data={[props.phaseAverage]}
              timeExtent={props.timeExtent}
              activeIndex={props.activeTrajectory.id === "average" ? "0" : "-1"}
              activePhase={props.activePhase}
              colorScale={props.colorScale}
              height={averageHeight}
              isAverage={true} />
          </div>
        </div>
        <div className="row in" id={collapseId} style={collapseRowStyle}>
          <div className="col-xs-10 col-xs-offset-2" style={collapseColStyle}>
            <PhaseMapContainer
              data={props.phases}
              timeExtent={props.timeExtent}
              activeIndex={props.activeTrajectory.id && props.activeTrajectory !== "average" ?
                           props.activeTrajectory.id : "-1"}
              activePhase={props.activePhase}
              colorScale={props.colorScale}
              height={props.phases.length * trackHeight} />
          </div>
        </div>
      </div>
    </div>
  );
}

Phases.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.object.isRequired,
  activePhase: PropTypes.string.isRequired,
  colorScale: PropTypes.func.isRequired
};

module.exports = Phases;
