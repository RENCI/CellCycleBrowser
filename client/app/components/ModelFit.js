var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("./Collapsible");
var ItemSelect = require("./ItemSelect");
var ComputeModelFitButton = require("./ComputeModelFitButton");

var style = {
  marginTop: 5,
  marginBottom: 5
}

function ModelFit(props) {
  function dataTrackValue(track) {
    return track.source + ": " + track.species;
  }

  var simulationOptions = props.modelFit.simulationTracks.map(function (track) {
    return {
      name: track.species,
      value: track.species
    };
  });

  var dataOptions = props.modelFit.dataTracks.map(function (track) {
    return {
      name: track.species,
      value: dataTrackValue(track),
      description: track.source
    };
  });

  var methodOptions = props.modelFit.methods.map(function (method) {
    // Make first letter uppercase
    var name = method.charAt(0).toUpperCase() + method.slice(1);

    return {
      name: name,
      value: method
    };
  });

  var noOption = {
    name: "NA",
    value: ""
  };

  if (simulationOptions.length === 0) simulationOptions = [noOption];
  if (dataOptions.length === 0) dataOptions = [noOption];

  var simulationValue = props.modelFit.simulationTrack ? props.modelFit.simulationTrack.species : noOption.value;
  var dataValue = props.modelFit.dataTrack ? dataTrackValue(props.modelFit.dataTrack) : noOption.value;

  var fit = props.modelFit.fit;
  var thresholds = props.modelFit.difference ? [0.6, 0.8] : [0.2, 0.6];
  var fitSpan = fit ?
    (
      <span
        className={"alert " + (
          fit < thresholds[0] ? "alert-danger" :
          fit < thresholds[1] ? "alert-warning" :
          "alert-success"
        )}
        style={{
          padding: 5
        }}>
          {fit.toFixed(3)}
      </span>
    )
  : null;

  return (
    <Collapsible
      id="modelFit"
      label="Model fit">
        <div style={style}>
          <ItemSelect
            label="Simulation: "
            options={simulationOptions}
            activeValue={simulationValue}
            onChange={props.onChangeSimulationSpecies} />
        </div>
        <div style={style}>
          <ItemSelect
            label="Data: "
            options={dataOptions}
            activeValue={dataValue}
            onChange={props.onChangeDataSpecies} />
        </div>
        <div style={style}>
          <ItemSelect
            label="Method: "
            options={methodOptions}
            activeValue={props.modelFit.method}
            onChange={props.onChangeMethod} />
        </div>
        <div style={style}>
          <ComputeModelFitButton
            label="Compute"
            disabled={!props.modelFit.simulationTrack || !props.modelFit.dataTrack}
            onClick={props.onComputeModel} />
          <strong style={{marginLeft: 10}}>Fit: </strong>{fitSpan}
        </div>
    </Collapsible>
  );
}

ModelFit.propTypes = {
  modelFit: PropTypes.object.isRequired,
  onChangeSimulationSpecies: PropTypes.func.isRequired,
  onChangeDataSpecies: PropTypes.func.isRequired,
  onChangeMethod: PropTypes.func.isRequired,
  onComputeModel: PropTypes.func.isRequired
};

module.exports = ModelFit;
