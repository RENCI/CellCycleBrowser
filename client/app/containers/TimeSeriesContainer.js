var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
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

class TimeSeriesContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.timeSeries = TimeSeries()
        .on("highlightTrace", this.handleHighlightTrace);

    this.state = {
      data: DataStore.getData(),
      alignment: AlignmentStore.getAlignment(),
      phaseColorScale: PhaseColorStore.getColorScale()
    };

    // Need to bind this to callback functions here
    this.onDataChange = this.onDataChange.bind(this);
    this.onAlignmentChange = this.onAlignmentChange.bind(this);
  }

  componentDidMount() {
    DataStore.addChangeListener(this.onDataChange);
    DataStore.addHighlightChangeListener(this.onDataChange);
    AlignmentStore.addChangeListener(this.onAlignmentChange);
  }

  componentWillUnmount() {
    DataStore.removeChangeListener(this.onDataChange);
    DataStore.removeHighlightChangeListener(this.onDataChange);
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
  }

  componentWillUpdate(props, state) {
    if (hasData(state.data)) {
      this.drawVisualization(props, state);
    };

    return false;
  }

  onDataChange() {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (this.refs[refName]) {
      this.setState(getStateFromDataStore());
    }
  }

  onAlignmentChange() {
    this.setState(getStateFromAlignmentStore());
  }

  drawVisualization(props, state) {
    this.timeSeries
        .width(props.width)
        .alignment(state.alignment)
        .phaseColorScale(state.phaseColorScale);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.timeSeries);
  }

  handleHighlightTrace(trace) {
    ViewActionCreators.highlightTrace(trace);
  }

  render() {
    return <div ref={refName}></div>
  }
}

// Don't make propsTypes required, as a warning is given for the first render
// if using React.cloneElement, as  in VisualizationContainer
TimeSeriesContainer.propTypes = {
  width: PropTypes.number
};

module.exports = TimeSeriesContainer;
