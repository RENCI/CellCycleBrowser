var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TimeScaleContainer = require("../containers/TimeScaleContainer");
var PhaseLineContainer = require("../containers/PhaseLineContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5,
  marginTop: 10,
  marginBottom: 10
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var phasesLabelStyle = {
  float: "none",
  display: "inline-block",
  marginLeft: 10
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
  paddingRight: 0
};

function Phases(props) {
  var collapseId = "phasesCollapse";

  return (
    <div className="text-left" style={outerStyle}>
      <div className="row">
        <div className="col-sm-2">
          <div style={labelStyle}>
            Time line
          </div>
        </div>
        <div className="col-sm-10 text-left">
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
                height={34}
                isAverage={true} />
            </div>
          </div>
          <div className="row in" id={collapseId}>
            <div className="col-sm-10 col-sm-offset-2">
              <PhaseMapContainer
                data={props.phases}
                timeExtent={props.timeExtent}
                activeIndex={props.activeTrajectory.id && props.activeTrajectory !== "average" ?
                             props.activeTrajectory.id : "-1"}
                activePhase={props.activePhase}
                height={props.phases.length * 20} />
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
  activePhase: PropTypes.string.isRequired
};

module.exports = Phases;
