var React = require("react");
var PropTypes = React.PropTypes;
var BrowserVisualizationContainer = require("./BrowserVisualizationContainer");

var BrowserContainer = React.createClass ({
  propTypes: {
    data: PropTypes.array.isRequired,
    domain: PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div>
        <h2>Browser</h2>
        <BrowserVisualizationContainer
          data={this.props.data}
          domain={this.props.domain} />
      </div>
    );
  }
});

module.exports = BrowserContainer;
