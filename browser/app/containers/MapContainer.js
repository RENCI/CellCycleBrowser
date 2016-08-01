// Controller-view for the map area

var React = require("react");
var PropTypes = React.PropTypes;
var ModelStore = require("../stores/ModelStore");
var MapControls = require("../components/MapControls");
var MapVisualizationContainer = require("./MapVisualizationContainer");

function getStateFromStore() {
  return {
    modelList: ModelStore.getModelList(),
    model: ModelStore.getModel()
  };
}

var MapContainer = React.createClass({
  getInitialState: function () {
    return {
      modelList: [],
      model: null
    };
  },
  componentDidMount: function () {
    ModelStore.addChangeListener(this.onModelChange);
  },
  componentWillUnmount: function() {
    ModelStore.removeChangeListener(this.onModelChange);
  },
  onModelChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    if (!this.state.model) return null;

    return (
      <div>
        <h2>Map</h2>
        <MapControls modelList={this.state.modelList} />
        <MapVisualizationContainer model={this.state.model} />
      </div>
    );
  }
});

module.exports = MapContainer;
