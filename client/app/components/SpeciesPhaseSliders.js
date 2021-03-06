var React = require("react");
var PropTypes = require("prop-types");
var Collapsible = require("../components/Collapsible");
var PhaseTabs = require("../components/PhaseTabs");
var VisualizationContainer = require("../containers/VisualizationContainer");
var ValueSliderContainer = require("../containers/ValueSliderContainer");
var InteractionColorStore = require("../stores/InteractionColorStore");

var labelStyle = {
  width: 80,
  marginRight: 5
};

var valueStyle = {
  width: 20,
  marginRight: 5
};

var interactionColorScale = InteractionColorStore.getColorScale();

function valueLabel(value) {
  return Math.round(value.value);
}

function SpeciesPhaseSliders(props) {
  if (props.species.length <= 1) return null;

  var sliders = props.phases.map(function(phase, i) {
    return props.species.map(function(species, j) {
      function handleChange(value) {
        props.onChange({
          species: species,
          phase: phase,
          value: value
        });
      }

      var value = props.matrix[species][phase];

      return (
        <div key={j} style={{display: "flex"}}>
          <div className="text-right" style={labelStyle}>
            <label>{species + "→" + phase}</label>
          </div>
          <div style={{flex: 1}}>
            <VisualizationContainer>
              <ValueSliderContainer
                min={value.min}
                max={value.max}
                initialValue={value.initialValue}
                value={value.value}
                handleColorScale={interactionColorScale}
                onChange={handleChange} />
            </VisualizationContainer>
          </div>
          <div className="text-right" style={valueStyle}>
            <label>{valueLabel(value)}</label>
          </div>
        </div>
      );
    });
  });

  return (
    <Collapsible
      id="speciesPhaseSliders"
      label="Species→phase interactions"
      onCollapse={props.onCollapse}>
        <PhaseTabs
          phases={props.phases}
          phaseColorScale={props.phaseColorScale}
          activePhase={props.activePhase}>
            {sliders}
        </PhaseTabs>
    </Collapsible>
  );
}

SpeciesPhaseSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrix: PropTypes.object.isRequired,
  phaseColorScale: PropTypes.func.isRequired,
  activePhase: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
