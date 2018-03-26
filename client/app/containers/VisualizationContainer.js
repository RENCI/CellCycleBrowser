var React = require("react");
var ReactDOM = require("react-dom");

class VisualizationContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      width: 100,
      height: 100
    };

    // Need to bind this to callback functions here
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    // Resize on window resize
    window.addEventListener("resize", this.onResize);

    this.onResize();
  }

  componentWillUnmount() {
    // Resize on window resize
    window.removeEventListener("resize", this.onResize);
  }

  componentWillReceiveProps() {
    this.onResize();
  }

  componentDidUpdate(prevProps, prevState) {
    var node = ReactDOM.findDOMNode(this);

    if (this.state.width !== node.clientWidth ||
        this.state.height !== node.clientHeight) {
      this.setState({
        width: node.clientWidth,
        height: node.clientHeight
      });
    }
  }

  getSize() {
    var node = ReactDOM.findDOMNode(this);

    return {
      width: node.clientWidth,
      height: node.clientHeight
    };
  }

  onResize() {
    this.setState(this.getSize());
  }

  render() {
    var props = {
      width: this.state.width,
      height: this.state.height
    };

    return React.cloneElement(this.props.children, props);
  }
}

module.exports = VisualizationContainer;
