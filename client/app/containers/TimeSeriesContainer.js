var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var d3 = require("d3");
var TimeSeries = require("../visualizations/TimeSeries");
var ViewActionCreators = require("../actions/ViewActionCreators");

var refName = "ref";

function getStateFromDataStore() {
  return {
    data: DataStore.getData()
  };
}

function getStateFromAlignmentStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  };
}

function hasData(data) {
  return data.tracks.length > 0;
}

var TimeSeriesContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.timeSeries = TimeSeries()
        .on("highlightTrace", this.handleHighlightTrace);

    return {
      data: DataStore.getData(),
      alignment: AlignmentStore.getAlignment(),
      phaseColorScale: PhaseColorStore.getColorScale()
    };
  },  
  componentDidMount: function() {
    DataStore.addChangeListener(this.onDataChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
  },
  componentWillUnmount: function () {
    DataStore.removeChangeListener(this.onDataChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
  },
  componentWillUpdate: function (props, state) {
    if (hasData(state.data)) {
      this.drawVisualization(props, state);
    };

/*
    var svgElement = d3.select(".timeSeries");

    var pdf = new jsPDF("p", "pt", [svgElement.attr("width"), svgElement.attr("height")]);

    // render the svg element
    svg2pdf(svgElement.node(), pdf, {
    	xOffset: 0,
    	yOffset: 0,
    	scale: 1
    });

    pdf.save("myPDF.pdf");
*/

    return false;
  },
  onDataChange: function () {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (this.refs[refName]) {
      this.setState(getStateFromDataStore());
    }
  },
  onAlignmentChange: function () {
    this.setState(getStateFromAlignmentStore());
  },
  drawVisualization: function (props, state) {
    this.timeSeries
        .width(props.width)
        .alignment(state.alignment)
        .phaseColorScale(state.phaseColorScale);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.timeSeries);
  },
  handleHighlightTrace: function (trace) {
    ViewActionCreators.highlightTrace(trace);
  },
  render: function () {
    return <div ref={refName}></div>
  }
});

module.exports = TimeSeriesContainer;
