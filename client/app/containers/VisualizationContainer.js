var React = require("react");
var ReactDOM = require("react-dom");

var divStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: 5
};

var VisualizationContainer = React.createClass ({
  getInitialState: function () {
    return {
      width: 1,
      height: 1
    };
  },
  componentDidMount: function() {
    // Resize on window resize
    window.addEventListener("resize", this.onResize);
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
  renderChildren: function () {
    return React.Children.map()
  },
  render: function () {
    var props = {
      width: this.state.width,
      height: this.state.height
    };

    return (
      <div style={divStyle}>
        {React.cloneElement(this.props.children, props)}
      </div>
    );
  }
});

module.exports = VisualizationContainer;
