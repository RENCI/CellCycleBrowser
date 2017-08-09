var React = require("react");
var PropTypes = React.PropTypes;
var CollapseButtonContainer = require("../containers/CollapseButtonContainer");
var TraceToggleButtons = require("./TraceToggleButtons");
var HeatMapContainer = require("../containers/HeatMapContainer");
var Constants = require("../constants/Constants");
var ViewActionCreators = require("../actions/ViewActionCreators");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5
};

var dragStyle = {
  cursor: "ns-resize"
};

var nameStyle = {
  marginTop: 5,
  marginLeft: 10,
  fontWeight: "bold"
};

var featureStyle = {
  fontStyle: "italic",
  fontWeight: "normal"
};

var sourceStyle = {
  flex: 1,
  marginTop: 5,
  marginRight: 10
};

var rescaleTracesStyle = {
  marginTop: 5,
  marginRight: 5
};

var colorStyle = {
  padding: 4,
  height: 32,
  width: 20
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

function Track(props) {
  // Generate unique id for species
  // XXX: Could pass in array index for this?
  var collapseId = props.track.species + "_" +
                   props.track.feature + "_" +
                   props.track.source + "_Collapse";

  // Remove non "word" characters
  collapseId = collapseId.replace(/\W/g, "");

  var averageHeight = 32;
  var traceHeight = 20;

  var featureSpan = props.track.feature ?
      <span style={featureStyle}>{" - " + props.track.feature}</span> : null;

  var traceSelected = props.track.average.selected ||
                      props.track.traces.reduce(function (p, c) {
                        return p || c.selected;
                      }, false);

  var m = colorStyle.padding;
  var h = (colorStyle.height - colorStyle.padding * 2 - m) / 2;

  var sourceColorStyle = {
    backgroundColor: props.track.sourceColor,
    width: "100%",
    height: h,
    borderRadius: h / 4,
    marginBottom: m,
    cursor: "default"
  };

  var trackColorStyle = {
    backgroundColor: props.track.color,
    width: "100%",
    height: h,
    borderRadius: h / 4,
    visibility: traceSelected ? "visible" : "hidden",
    cursor: "default"
  };

  function onDragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(Constants.drag_track_type, props.track.index);
  }

  var phases;
  var averagePhases;

  if (props.track.source === "Simulation") {
    phases = props.phases;
    averagePhases = [props.phaseAverage];
  }
  else {
    phases = props.track.traces.map(function () {
      return props.activePhases;
    });

    averagePhases = [props.activePhases];
  }

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

  function handleRescaleTracesClick() {
    ViewActionCreators.rescaleTraces(props.track);
  }

  return (
    <div className="text-left" style={outerStyle}>
      <div
        className="row"
        style={dragStyle}
        draggable="true"
        onDragStart={onDragStart}>
          <div className="col-xs-12" style={{display: "flex"}}>
            <div style={nameStyle}>
              {props.track.species}
              {featureSpan}
            </div>
            <div className="text-right" style={sourceStyle}>{props.track.source}</div>
            <div style={rescaleTracesStyle}>
              <label
                className={"btn btn-default btn-xs" + (props.track.rescaleTraces ? " active" : "")}
                data-toggle="tooltip"
                data-container="body"
                data-placement="auto top"
                title={"Rescale traces"}
                onClick={handleRescaleTracesClick}>
                  <span
                    className="glyphicon glyphicon-equalizer"
                    style={{color: "#aaa"}} />
              </label>
            </div>
            <div style={colorStyle}>
              <div
                style={sourceColorStyle}
                data-toggle="tooltip"
                data-container="body"
                data-placement="auto top"
                title="Source color">
              </div>
              <div
                style={trackColorStyle}
                data-toggle="tooltip"
                data-container="body"
                data-placement="auto top"
                title="Track color">
              </div>
            </div>
          </div>
      </div>
      <div>
        <div className="row" style={rowStyle}>
          <div className="col-xs-2" style={buttonColumnStyle}>
            <CollapseButtonContainer targetId={collapseId} />
            <div style={{float:"right"}}>
              <TraceToggleButtons
                traces={[props.track.average]}
                width={traceHeight}
                height={averageHeight} />
            </div>
          </div>
          <div className="col-xs-10" style={visColumnStyle}>
            <HeatMapContainer
              data={[props.track.average.values]}
              dataExtent={averageExtent}
              phases={averagePhases}
              timeExtent={props.timeExtent}
              activePhase={props.activePhase}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={averageHeight} />
          </div>
        </div>
        <div className="row in" id={collapseId} style={collapseRowStyle}>
          <div className="col-xs-2" style={traceButtonColumnStyle}>
            <div style={{float:"right"}}>
              <TraceToggleButtons
                traces={props.track.traces}
                width={traceHeight}
                height={traceHeight} />
            </div>
          </div>
          <div className="col-xs-10" style={collapseColumnStyle}>
            <HeatMapContainer
              data={props.track.traces.map(function (d) { return d.values; })}
              dataExtent={dataExtent}
              phases={phases}
              timeExtent={props.timeExtent}
              activePhase={props.activePhase}
              phaseColorScale={props.phaseColorScale}
              phaseOverlayOpacity={props.phaseOverlayOpacity}
              height={props.track.traces.length * traceHeight} />
          </div>
        </div>
      </div>
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
  activePhases: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePhase: PropTypes.string.isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  phaseOverlayOpacity: PropTypes.number.isRequired
};

module.exports = Track;
