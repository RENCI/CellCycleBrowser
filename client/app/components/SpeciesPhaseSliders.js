var React = require("react");
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

    return {
      tab: (
        <li className={"nav" + (i === 0 ? " active" : "")} key={i}>
          <a href={"#" + tabId} data-toggle="tab">{phase}</a>
        </li>
      ),
      content: (
        <div
          id={tabId}
          key={i}
          className={"tab-pane fade" + (i === 0 ? " in active" : "")}>
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
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
