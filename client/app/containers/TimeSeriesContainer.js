var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var d3 = require("d3");
var TimeSeries = require("../visualizations/TimeSeries");

function getStateFromStore() {
  return {
    data: DataStore.getData()
  };
}

function hasData(data) {
  return data.tracks.length > 0;
}

var defaultLabel = "Loading";

var TimeSeriesContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.timeSeries = TimeSeries();

    return getStateFromStore();
  },
  componentDidMount: function() {
    DataStore.addChangeListener(this.onDataChange);
  },
  componentWillUnmount: function () {
    DataStore.removeChangeListener(this.onDataChange);
  },
  componentWillUpdate: function (props, state) {
    if (hasData(state.data)) {
      this.drawVisualization(props, state);
    };

    return false;
  },
  onDataChange: function () {
    this.setState(getStateFromStore());
  },
  drawVisualization: function (props, state) {
    this.timeSeries
        .width(props.width);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.timeSeries);
  },
  render: function () {
    return <div></div>
  }
});

module.exports = TimeSeriesContainer;
