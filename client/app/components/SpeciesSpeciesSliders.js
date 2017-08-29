var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var PhaseTabs = require("../components/PhaseTabs");
var ValueSliderContainer = require("../containers/ValueSliderContainer");
var d3 = require("d3");

var hrStyle = {
  marginTop: 5,
  marginBottom: 10
};

var labelStyle = {
  width: 50,
  marginLeft: 5
};

var valueStyle = {
  width: 20,
  marginLeft: 5
};

function valueLabel(value) {
  return Math.round(value.value);
}

function SpeciesSpeciesSliders(props) {
  if (props.species.length <= 1) return null;

  // TODO: Move to global settings somewhere
  var epsilon = Number.EPSILON;
  var linkColorScale = d3.scaleLinear()
      .domain([-10, -epsilon, 0, epsilon, 10])
      .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]);

  var sliders = props.phases.map(function (phase, i) {
    var sliders = [];
    props.species.forEach(function (upstream, j) {
      props.species.forEach(function (downstream, k) {
        if (j === k) return;

        function handleChange(value) {
          props.onChange({
            phase: phase,
            upstream: upstream,
            downstream: downstream,
            value: value
          });
        }

        var value = props.matrices[phase][upstream][downstream];

        if (k === 0 || (j === 0 && k === 1)) {
          sliders.push(
            <div key={"header" + j} style={{display: "flex"}}>
              <div>
                <small>{phase}</small>
              </div>
              <div style={{flex: 1}}>
                <label>{upstream + "→"}</label>
              </div>
              <div style={{width: 50}}>
              </div>
            </div>
          );
        }

        sliders.push(
          <div key={j * props.species.length + k} style={{display: "flex"}}>
            <div style={{flex: 1}}>
              <ValueSliderContainer
                min={value.min}
                max={value.max}
                value={value.value}
                handleColorScale={linkColorScale}
                onChange={handleChange} />
            </div>
            <div className="text-left" style={labelStyle}>
              <label>{downstream + ":"}</label>
            </div>
            <div className="text-right" style={valueStyle}>
              <label>{valueLabel(value)}</label>
            </div>
          </div>
        );

        var numSpecies = props.species.length;
        if (j < numSpecies - 1 && k === numSpecies - 1) {
          sliders.push(
            <hr
              key={"line" + j}
              style={hrStyle} />
          );
        }
      });
    });

    return sliders;
  });

  return (
    <Collapsible
      id="speciesSpeciesSliders"
      label="Species→species interactions"
      onCollapse={props.onCollapse}>
        <PhaseTabs
          phases={props.phases}
          activePhase={props.activePhase}>
            {sliders}
        </PhaseTabs>
    </Collapsible>
  );
}

SpeciesSpeciesSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrices: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired
};

module.exports = SpeciesSpeciesSliders;
