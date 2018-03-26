// Invoke the supplied callback whenever the iframe changes width, which
// accounts for scrollbars being added/removed.
// Adapted from: https://gist.github.com/AdamMcCormick/d5f718d2e9569acdf7def25e8266bb2a

var React = require("react");
var PropTypes = require("prop-types");

var style = {
  height: 0,
  margin: 0,
  padding: 0,
  overflow: "hidden",
  borderWidth: 0,
  position: "absolute",
  backgroundColor: "transparent",
  width: "100%"
};

class ResizeContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.refs.frame.contentWindow.addEventListener("resize", this.props.onResize, false);
  }

  componentWillUnmount() {
    this.refs.frame.contentWindow.removeEventListener("resize", this.props.onResize);
  }
  render() {
    return <iframe ref="frame" style={style} />
  }
}

ResizeContainer.propTypes = {
  onResize: PropTypes.func.isRequired
};

module.exports = ResizeContainer;
