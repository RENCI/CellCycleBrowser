var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var PointTest = require("../visualizations/PointTest");

// TODO: Move to css file
var divStyle = {
  backgroundColor: "white",
  borderColor: "#ddd",
  borderStyle: "solid",
  borderWidth: "2px",
  borderRadius: 5
};

var BrowserVisualizationContainer = React.createClass ({
  propTypes: {
    data: React.PropTypes.array
  },
  componentDidMount: function() {
    PointTest.create(
      ReactDOM.findDOMNode(this),
      {
        width: "100%",
        height: "300px"
      },
      this.getChartState()
    );
  },
  componentDidUpdate: function() {
    PointTest.update(ReactDOM.findDOMNode(this), this.getChartState());
  },
  getChartState: function() {
    return {
      data: this.props.data,
      domain: domain
    };
  },
  componentWillUnmount: function() {
    PointTest.destroy(ReactDOM.findDOMNode(this));
  },
  render: function() {
    return <div className="Browser" style={divStyle}></div>
  }
});

module.exports = BrowserVisualizationContainer;
