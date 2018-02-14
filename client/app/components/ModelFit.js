var React = require("react");
var PropTypes = React.PropTypes;

function ModelFit(props) {
  return (
    <div></div>
  );
}

ModelFit.propTypes = {
  modelFit: PropTypes.object.isRequired,
  onChangeSimulationSpecies: PropTypes.func.isRequired,
  onChangeDatasetSpecies: PropTypes.func.isRequired,
  onComputeModel: PropTypes.func.isRequired
};

module.exports = ModelFit;
