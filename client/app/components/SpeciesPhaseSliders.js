var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

function SpeciesPhaseSliders(props) {
  // TODO: Move to global settings somewhere
  var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(props.phases);

  // TODO: Move to global settings somewhere
  var linkColorScale = d3.scaleLinear()
      .domain([-1, -Number.EPSILON, 0, Number.EPSILON, 1])
      .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]);

  var tabs = props.phases.map(function(phase, i) {
    var sliders = props.species.map(function(species, j) {
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
          <div className="text-right" style={{width: 80, marginRight: 5}}>
            <label>{species + "→" + phase}</label>
          </div>
          <div style={{flex: 1}}>
            <ValueSliderContainer
              min={value.min}
              max={value.max}
              value={value.value}
              handleColorScale={linkColorScale}
              onChange={handleChange} />
          </div>
        </div>
      );
    });

    var tabId = "speciesPhase" + phase;
    var active = (props.activePhase === "" && i === 0) || phase === props.activePhase;

    return {
      tab: (
        <li
          className={"nav" + (active ? " active" : "")} key={i}>
            <a
              href={"#" + tabId}
              data-toggle="tab"
              style={{
                backgroundColor: colorScale(phase),
                color: "black"
              }}>
                {phase}
            </a>
        </li>
      ),
      content: (
        <div
          id={tabId}
          className={"tab-pane fade" + (active ? " in active" : "")}
          style={{
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colorScale(phase),
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            marginBottom: 10,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5
          }}
          key={i}>
            {sliders}
        </div>
      )
    };
  });

  return (
    <Collapsible
      id="speciesPhaseSliders"
      label="Species→phase interactions">
        <ul className="nav nav-tabs" style={{marginTop: 5}}>
          {tabs.map(function(tab) { return tab.tab; })}
        </ul>
        <div className="tab-content">
          {tabs.map(function(tab) { return tab.content; })}
        </div>
    </Collapsible>
  );
}

SpeciesPhaseSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrix: PropTypes.object.isRequired,
  activePhase: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
