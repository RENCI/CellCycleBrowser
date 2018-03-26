var React = require("react");
var ReactDOM = require("react-dom");

class VisualizationContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      width: 100,
      height: 100
    };
  }

  componentDidMount() {
    this.checkSize();
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkSize();
  }

  checkSize() {
    var node = ReactDOM.findDOMNode(this);

    if (this.state.width !== node.clientWidth ||
        this.state.height !== node.clientHeight) {
      this.setState({
        width: node.clientWidth,
        height: node.clientHeight
      });
    }
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
