var React = require("react");
var PropTypes = React.PropTypes;
var ReactDOM = require("react-dom");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5
};

var VisualizationContainer = React.createClass ({
  propTypes: {
    info: PropTypes.element
  },
  getInitialState: function () {
    return {
      width: 100,
      height: 100
    };
  },
  componentDidMount: function () {
    // Resize on window resize
    window.addEventListener("resize", this.onResize);

    this.onResize();
  },
  componentWillUnmount: function () {
    // Resize on window resize
    window.removeEventListener("resize", this.onResize);
  },
  componentWillReceiveProps: function () {
    this.onResize();
  },
  getSize: function () {
    var node = ReactDOM.findDOMNode(this);

    return {
      width: node.clientWidth,
      height: node.clientHeight
    };
  },
  onResize: function () {
    this.setState(this.getSize());
  },
  render: function () {
    var props = {
      width: this.state.width,
      height: this.state.height
    };

    return (
      <div style={divStyle}>
        {this.props.info}
        {React.cloneElement(this.props.children, props)}
      </div>
    );
  }
});

module.exports = VisualizationContainer;
