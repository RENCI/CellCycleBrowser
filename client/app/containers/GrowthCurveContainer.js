var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var DataStore = require("../stores/DataStore");
var d3 = require("d3");
var GrowthCurve = require("../visualizations/GrowthCurve");

var refName = "ref";

function getStateFromStore() {
  return {
    tracks: DataStore.getData().tracks
  };
}

class GrowthCurveContainer extends React.Component {
  constructor() {
    super();

    // Create visualization function
    this.growthCurve = GrowthCurve();

    this.state = getStateFromStore();

    // Need to bind this to callback functions here
    this.onDataChange = this.onDataChange.bind(this);
  }

  componentDidMount() {
    DataStore.addChangeListener(this.onDataChange);
  }

  componentWillUnmount() {
    DataStore.removeChangeListener(this.onDataChange);
  }

  componentWillUpdate(props, state) {
    if (state.tracks.length > 0) {
      this.drawVisualization(props, state);
    };

    return false;
  }

  onDataChange() {
    // XXX: I think this is necessary because we are getting state from a store
    // here that is already being retrieved in a parent component. Try passing
    // down that state instead?
    if (this.refs[refName]) {
      this.setState(getStateFromStore());
    }
  }

  drawVisualization(props, state) {
    this.growthCurve
        .width(props.width);

    d3.select(ReactDOM.findDOMNode(this))
        .datum(state.tracks)
        .call(this.growthCurve);
  }

  render() {
    return <div ref={refName}></div>
  }
}

// Don't make propsTypes required, as a warning is given for the first render
// if using React.cloneElement, as  in VisualizationContainer
GrowthCurveContainer.propTypes = {
  width: PropTypes.number
};

module.exports = GrowthCurveContainer;
