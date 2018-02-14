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

  var noOption = {
    name: "NA",
    value: ""
  };

  if (simulationOptions.length === 0) simulationOptions = [noOption];
  if (dataOptions.length === 0) dataOptions = [noOption];

  var simulationValue = props.modelFit.simulationTrack ? props.modelFit.simulationTrack.species : noOption.value;
  var dataValue = props.modelFit.dataTrack ? dataTrackValue(props.modelFit.dataTrack) : noOption.value;

  var fit = props.modelFit.fit;
  var fitSpan = fit ?
    (
      <span
        className={"alert " + (fit < 0.6 ? "alert-danger" : fit < 0.8 ? "alert-warning" : "alert-success")}
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
          <ComputeModelFitButton
            label="Compute"
            disabled={!props.modelFit.simulationTrack || !props.modelFit.dataTrack}
            onClick={props.onComputeModel} />
          <strong> Fit: </strong>{fitSpan}
        </div>
    </Collapsible>
  );
}

ModelFit.propTypes = {
  modelFit: PropTypes.object.isRequired,
  onChangeSimulationSpecies: PropTypes.func.isRequired,
  onChangeDataSpecies: PropTypes.func.isRequired,
  onComputeModel: PropTypes.func.isRequired
};

module.exports = ModelFit;
