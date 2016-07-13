var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var ChordMap = require("../visualizations/ChordMap");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

var MapVisualizationContainer = React.createClass ({
  propTypes: {
    map: PropTypes.object.isRequired
  },
  componentDidMount: function() {
    ChordMap.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "300px"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    ChordMap.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      map: this.props.map
    };
  },
  componentWillUnmount: function() {
    ChordMap.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="Map" style={divStyle}></div>
  }
});

module.exports = MapVisualizationContainer;
