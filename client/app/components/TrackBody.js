var React = require("react");
var PropTypes = require("prop-types");
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var DendrogramContainer = require("../containers/DendrogramContainer");
var TraceControlsContainer = require("../containers/TraceControlsContainer");
var VisualizationContainer = require("../containers/VisualizationContainer");
var HeatMapContainer = require("../containers/HeatMapContainer");

var border = "1px solid #ccc";

var averageRowStyle = {
  marginLeft: 0,
  marginRight: -1,
  border: border,
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5
};

var buttonColumnStyle = {
  padding: 0
};

var dendrogramColumnStyle = {
  padding: 0
};

var traceControlColumnStyle = {
  padding: 0,
  marginTop: -1
};

var averageColumnStyle = {
  padding: 0,
  borderLeft: border
};

var collapseRowStyle = {
  // Make up for border in averageRowStyle
  marginLeft: 1,
  marginRight: 0
};

var collapseColumnStyle = {
  padding: 0,
  borderLeft: border
};

function TrackBody(props) {
  // Id for collapse button/content
  var collapseId = props.track.id + "_Collapse";

  var collapseClasses = "row collapse" + (props.track.collapse ? "" : " in");

  var averageHeight = 32;
  var traceHeight = 20;

  var phaseAverage = props.track.showPhaseOverlay ? props.track.phaseAverage : [];
  var phases = props.track.showPhaseOverlay ? props.track.traces.map(function (trace) {
    return props.track.phases[trace.index];
  }) : [];

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

  var averageCol1 = props.shiftRight ? "col-xs-3" : "col-xs-2";
  var averageCol2 = props.shiftRight ? "col-xs-9" : "col-xs-10";

  var col1 = props.shiftRight ? "col-xs-2" : "col-xs-0";
  var col2 = props.shiftRight ?"col-xs-1" : "col-xs-2";
  var col3 = props.shiftRight ? "col-xs-9" : "col-xs-10";

  return (
    <div>
      <div className="row" style={averageRowStyle}>
        <div className={averageCol1} style={buttonColumnStyle}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <CollapseButtonContainer
              targetId={collapseId}
              track={props.track} />
            <div style={{flex: 1}}>
              <TraceControlsContainer
                traces={[props.track.average]}
                width={traceHeight}
                height={averageHeight} />
            </div>
          </div>
        </div>
        <div className={averageCol2} style={averageColumnStyle}>
          <VisualizationContainer>
            <HeatMapContainer
              data={[props.track.average.values]}
              dataExtent={averageExtent}
              phases={[phaseAverage]}
              timeExtent={props.timeExtent}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              rowHeight={averageHeight} />
            </VisualizationContainer>
        </div>
      </div>
      <div className={collapseClasses} id={collapseId} style={collapseRowStyle}>
        <div className={col1} style={dendrogramColumnStyle}>
          {props.track.showDendrogram ?
            <VisualizationContainer>
              <DendrogramContainer
                cluster={props.track.cluster}
                rowHeight={traceHeight} />
            </VisualizationContainer>
          : null}
        </div>
        <div className={col2} style={traceControlColumnStyle}>
          <TraceControlsContainer
            traces={props.track.traces}
            width={traceHeight}
            height={traceHeight} />
        </div>
        <div className={col3} style={collapseColumnStyle}>
          <VisualizationContainer>
            <HeatMapContainer
              data={props.track.traces.map(function (d) { return d.values; })}
              dataExtent={dataExtent}
              phases={phases}
              timeExtent={props.timeExtent}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              rowHeight={traceHeight} />
          </VisualizationContainer>
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
  showPhaseOverlay: PropTypes.bool.isRequired,
  shiftRight: PropTypes.bool.isRequired
};

module.exports = TrackBody;
