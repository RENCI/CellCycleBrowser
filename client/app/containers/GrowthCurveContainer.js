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

var defaultLabel = "Loading";

var GrowthCurveContainer = React.createClass ({
  // Don't make propsTypes required, as a warning is given for the first render
  // if using React.cloneElement, as  in VisualizationContainer
  propTypes: {
    width: PropTypes.number
  },
  getInitialState: function () {
    // Create visualization function
    this.growthCurve = GrowthCurve();

    return {
      data: DataStore.getData(),
      label: defaultLabel
    };
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

    if (!hasData(DataStore.getData())) {
      // Create timer for label
      var count = 0;
      (function timer() {
        if (count > 0 && hasData(this.state.data)) {
          // Reset label to default
          this.setState({
            label: defaultLabel
          });

          return;
        }

        // Modify label
        this.setState({
          label: defaultLabel + ".".repeat(count % 4)
        });

        count++;

        setTimeout(timer.bind(this), 500);
      }.bind(this))();
    }
  },
  drawVisualization: function (props, state) {
    this.growthCurve
        .width(props.width)
        .height(props.width)

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.data)
        .call(this.growthCurve);
  },
  render: function () {
    return (
      <div>
        {!hasData(this.state.data) ?
          <h3 style={{marginBottom: 20}}>
            {this.state.label}
          </h3>
          : null}
      </div>
    );
  }
});

module.exports = GrowthCurveContainer;
