var React = require("react");
var PropTypes = React.PropTypes;
var MapVisualizationContainer = require("./MapVisualizationContainer");

var MapContainer = React.createClass ({
  propTypes: {
    data: PropTypes.array.isRequired,
    domain: PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div>
        <h2>Map</h2>
        <MapVisualizationContainer
          data={this.props.data}
          domain={this.props.domain} />
      </div>
    );
  }
});

module.exports = MapContainer;
