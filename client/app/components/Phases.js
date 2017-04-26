var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TimeScaleContainer = require("../containers/TimeScaleContainer");
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

var timeLineRowStyle = {
  marginLeft: -1,
  marginRight: -1
};

var timeLineStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  borderLeft: "1px solid #ccc"
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: -5,
  fontWeight: "bold"
};

var phasesLabelStyle = {
  float: "none",
  display: "inline-block",
  marginLeft: 10
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
  var collapseId = "phasesCollapse";

  var averageHeight = 32;
  var trackHeight = 20;

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row" style={timeLineRowStyle}>
        <div className="col-sm-2">
          <div style={labelStyle}>
            Time (h)
          </div>
        </div>
        <div className="col-sm-10 text-left" style={timeLineStyle}>
          <TimeScaleContainer timeExtent={props.timeExtent} />
        </div>
      </div>
      {props.phases.length > 0 ?
        <div>
          <div className="row" style={rowStyle}>
            <div className="col-sm-2 text-left" style={buttonColumnStyle}>
              <CollapseButtonContainer targetId={collapseId} />
              <div style={phasesLabelStyle}>
                Phases
              </div>
            </div>
            <div className="col-sm-10" style={visColumnStyle}>
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
            <div className="col-sm-10 col-sm-offset-2" style={collapseColStyle}>
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
      : null}
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
