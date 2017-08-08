var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var PhaseLineContainer = require("../containers/PhaseLineContainer");
var PhaseMapContainer = require("../containers/PhaseMapContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

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

var nameStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var checkboxStyle = {
  flex: 1,
  marginTop: 4
};

var sourceStyle = {
  marginTop: 5,
  marginRight: 30
};

var rowStyle = {
  margin: 0,
  border: "1px solid #ccc",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  padding: 0
};

var visColumnStyle = {
  padding: 0,
  borderLeft: "1px solid #ccc"
};

var collapseRowStyle = {
  // Make up for border in rowStyle
  marginLeft: 1,
  marginRight: 0,
  borderRight: "1px solid #ccc"
};

var collapseColumnStyle = {
  padding: 0,
  borderLeft: "1px solid #ccc"
};

function handleShowPhaseOverlayChange(e) {
  ViewActionCreators.changeShowPhaseOverlay(e.currentTarget.checked);
}

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
        <div className="col-xs-12" style={{display: "flex"}}>
          <div style={nameStyle}>
            Phases
          </div>
          <div className="text-center" style={checkboxStyle}>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                onChange={handleShowPhaseOverlayChange} />
              Show overlay
            </label>
          </div>
          <div className="text-right" style={sourceStyle}>
            Simulation
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
          <div className="col-xs-10 col-xs-offset-2" style={collapseColumnStyle}>
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
