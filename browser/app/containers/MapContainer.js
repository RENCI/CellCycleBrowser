var React = require("react");
var PropTypes = React.PropTypes;
var MapVisualizationContainer = require("./MapVisualizationContainer");

var MapContainer = React.createClass ({
  propTypes: {
    map: PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div>
        <h2>Map</h2>
        <MapVisualizationContainer map={this.props.map} />
      </div>
    );
  }
});

module.exports = MapContainer;
