var React = require("react");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");
var SliderContainer = require("../containers/SliderContainer");
var PropTypes = React.PropTypes;

var buttonStyle = {
  width: "100%"
}

var divStyle = {
  marginLeft: 10,
  marginRight: 10
}

function SpeciesPhaseSliders(props) {
  // TODO: Move to global settings somewhere
  var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(props.phases);

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

      return(
        <SliderContainer
          key={j}
          label={species + "→" + phase}
          min={value.min}
          max={value.max}
          initialValue={value.value}
          onChange={handleChange} />
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

  var collapseId = "speciesPhaseSliders";

  return (
    <div className="panel panel-default">
      <button
        type="button"
        className="btn btn-info"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Species→phase interactions
      </button>
      <div className="in" id={collapseId} style={divStyle}>
        <ul className="nav nav-tabs">
          {tabs.map(function(tab) { return tab.tab; })}
        </ul>
        <div className="tab-content">
          {tabs.map(function(tab) { return tab.content; })}
        </div>
      </div>
    </div>
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
