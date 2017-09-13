var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TraceToggleButtons = require("./TraceToggleButtons");
var HeatMapContainer = require("../containers/HeatMapContainer");
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

function TrackBody(props) {
  // Generate unique id for track
  var collapseId = props.track.species + "_" +
                   props.track.feature + "_" +
                   props.track.source + "_Collapse";

  // Remove non "word" characters
  collapseId = collapseId.replace(/\W/g, "");

  var averageHeight = 32;
  var traceHeight = 20;

  var phaseAverage = props.track.showPhaseOverlay ? props.track.phaseAverage : [];
  var phases = props.track.showPhaseOverlay ? props.track.phases : [];

  var averageExtent = !props.track.rescaleTraces ? [props.track.dataExtent] :
    [extent(props.track.average.values.map(function(v) { return v.value; }))];

  var dataExtent = props.track.traces.map(function (trace) {
    if (!props.track.rescaleTraces) {
      return props.track.dataExtent;
    }
    else {
      return extent(trace.values.map(function (v) { return v.value; }));
    }
  });

  function extent(values) {
    return [Math.min.apply(null, values), Math.max.apply(null, values)];
  }

  function handleTraceButtonClick(trace) {
    ViewActionCreators.selectTrace(trace, !trace.selected);
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
            <HeatMapContainer
              data={[props.track.average.values]}
              dataExtent={averageExtent}
              phases={[phaseAverage]}
              timeExtent={props.timeExtent}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={averageHeight} />
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
            <HeatMapContainer
              data={props.track.traces.map(function (d) { return d.values; })}
              dataExtent={dataExtent}
              phases={phases}
              timeExtent={props.timeExtent}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={props.track.traces.length * traceHeight} />
          </div>
        </div>
      </div>
  );
}

TrackBody.propTypes = {
  track: PropTypes.object.isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired,
  showPhaseOverlay: PropTypes.bool.isRequired
};

module.exports = TrackBody;
