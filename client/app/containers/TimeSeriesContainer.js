var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var AlignmentStore = require("../stores/AlignmentStore");
var d3 = require("d3");
var TimeSeries = require("../visualizations/TimeSeries");

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
    this.timeSeries = TimeSeries();

    return {
      data: DataStore.getData(),
      alignment: AlignmentStore.getAlignment()
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

    return false;
  },
  onDataChange: function () {
    this.setState(getStateFromDataStore());
  },
  onAlignmentChange: function () {
    this.setState(getStateFromAlignmentStore());
  },
  drawVisualization: function (props, state) {
    this.timeSeries
        .width(props.width)
        .alignment(state.alignment);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.timeSeries);
  },
  render: function () {
    return <div></div>
  }
});

module.exports = TimeSeriesContainer;
