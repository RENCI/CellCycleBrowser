var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var DataStore = require("../stores/DataStore");
var d3 = require("d3");
var GrowthCurve = require("../visualizations/GrowthCurve");

function getStateFromStore() {
  return {
    data: DataStore.getData()
  };
}

function hasData(data) {
  return data.tracks.length > 0;
}

var GrowthCurveContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.growthCurve = GrowthCurve();

    return getStateFromStore();
  },
  componentDidMount: function () {
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
    this.growthCurve
        .width(props.width);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.growthCurve);
  },
  render: function () {
    return <div></div>
  }
});

module.exports = GrowthCurveContainer;
