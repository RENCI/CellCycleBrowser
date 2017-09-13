var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TraceToggleButtons = require("./TraceToggleButtons");
var PhaseMapContainer = require("../containers/PhaseMapContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

var rowStyle = {
  margin: 0,
  border: "1px solid #ccc",
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  padding: 0
};

var traceButtonColumnStyle = {
  padding: 0,
  marginTop: -1
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

function PhaseTrackBody(props) {
  // Generate unique id for track
  var collapseId = props.track.species + "_" +
                   props.track.feature + "_" +
                   props.track.source + "_Collapse";

  // Remove non "word" characters
  collapseId = collapseId.replace(/\W/g, "");

  var averageHeight = 32;
  var traceHeight = 20;

  function handleTraceButtonClick(trace) {
    ViewActionCreators.selectPhaseTrace(trace, !trace.selected);
  }

  return (
    <div>
      <div className="row" style={rowStyle}>
        <div className="col-xs-2" style={buttonColumnStyle}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{flex: 1}}>
              <CollapseButtonContainer
                targetId={collapseId}
                track={props.track} />
              </div>
            <div style={{flex: "0 1 auto", width: traceHeight}}>
              <TraceToggleButtons
                traces={[props.track.average]}
                height={averageHeight}
                onClick={handleTraceButtonClick} />
              </div>
          </div>
        </div>
        <div className="col-xs-10" style={visColumnStyle}>
          <PhaseMapContainer
            data={[props.track.average.phases]}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory === "average" ? "0" : "-1"}
            colorScale={props.colorScale}
            height={averageHeight}
            isAverage={true}
            alignment={props.alignment} />
        </div>
      </div>
      <div className="row collapse in" id={collapseId} style={collapseRowStyle}>
        <div className="col-xs-2" style={traceButtonColumnStyle}>
          <div style={{display: "flex"}}>
            <div style={{flex: 1}} />
            <div style={{flex: "0 1 auto", width: traceHeight}}>
              <TraceToggleButtons
                traces={props.track.traces}
                height={traceHeight}
                onClick={handleTraceButtonClick} />
            </div>
          </div>
        </div>
        <div className="col-xs-10" style={collapseColumnStyle}>
          <PhaseMapContainer
            data={props.track.traces.map(function (d) { return d.phases; })}
            timeExtent={props.timeExtent}
            activeIndex={props.activeTrajectory && props.activeTrajectory !== "average" ?
                         props.activeTrajectory : "-1"}
            colorScale={props.colorScale}
            height={props.track.traces.length * traceHeight}
            alignment={props.alignment}  />
        </div>
      </div>
    </div>
  );
}

PhaseTrackBody.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeTrajectory: PropTypes.string,
  colorScale: PropTypes.func.isRequired,
  alignment: PropTypes.string.isRequired
};

module.exports = PhaseTrackBody;
