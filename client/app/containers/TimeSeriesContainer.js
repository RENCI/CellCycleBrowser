var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var PhaseColorStore = require("../stores/PhaseColorStore");
var d3 = require("d3");
var TimeSeries = require("../visualizations/TimeSeries");
var ViewActionCreators = require("../actions/ViewActionCreators");

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
      phaseColorScale: PhaseColorStore.getColorScale(),
      processing: false
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

  shouldComponentUpdate(props, state) {
    if (hasData(state.data) && !this.processing) {
      this.drawVisualization(props, state);
    };

    return false;
  }

  onDataChange() {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (this.div) {
      this.updateState(getStateFromDataStore());
    }
  }

  onAlignmentChange() {
    this.updateState(getStateFromAlignmentStore());
  }

  // XXX: Need to look at data flow again, passing all data down from
  // AppContainer, and doing checks where necessary for updating
  updateState(state) {
    if (!this.div) return;

    this.setState({
      processing: true
    }, function () {
      setTimeout(function () {
        if (!this.div) return;
        
        this.setState({
          processing: false
        });

        if (state) this.setState(state);
      }.bind(this), 0);
    });
  }

  drawVisualization(props, state) {
    this.timeSeries
        .width(props.width)
        .alignment(state.alignment)
        .phaseColorScale(state.phaseColorScale);

    d3.select(this.div)
        .datum(state.data)
        .call(this.timeSeries);
  }

  handleHighlightTrace(trace) {
    ViewActionCreators.highlightTrace(trace);
  }

  render() {
    return <div ref={div => this.div = div}></div>
  }
}

// Don't make propsTypes required, as a warning is given for the first render
// if using React.cloneElement, as  in VisualizationContainer
TimeSeriesContainer.propTypes = {
  width: PropTypes.number
};

module.exports = TimeSeriesContainer;
