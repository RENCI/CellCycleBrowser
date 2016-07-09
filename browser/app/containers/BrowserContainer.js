var React = require("react");
var PropTypes = React.PropTypes;
var BrowserVisualizationContainer = require("./BrowserVisualizationContainer");

var BrowserContainer = React.createClass ({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
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
