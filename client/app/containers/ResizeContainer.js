// Throw a window resize event whenever this iframe changes width, which
// accounts for scrollbars being added/removed.
// Adapted from: https://gist.github.com/AdamMcCormick/d5f718d2e9569acdf7def25e8266bb2a

var React = require("react");

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

    // Need to bind this to callback functions here
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.refs.frame.contentWindow.addEventListener("resize", this.onResize, false);
  }

  componentWillUnmount() {
    this.refs.frame.contentWindow.removeEventListener("resize", this.onResize);
  }

  onResize() {
    try {
      window.dispatchEvent(new UIEvent("resize"));
    } catch (d) {}
  }

  render() {
    return <iframe ref="frame" style={style} />
  }
}

module.exports = ResizeContainer;
