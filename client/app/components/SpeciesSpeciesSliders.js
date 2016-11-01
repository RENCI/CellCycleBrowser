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

function SpeciesSpeciesSliders(props) {
  var tabs = props.phases.map(function (phase, i) {
    var sliders = [];
    props.species.forEach(function (upstream, j) {
      props.species.forEach(function (downstream, k) {
        if (k === j) return;

        function handleChange(value) {
          props.onChange({
            phase: phase,
            upstream: upstream,
            downstream: downstream,
            value: value
          });
        }

        var value = props.matrices[phase][upstream][downstream];

        sliders.push(
          <SliderContainer
            key={j * props.species.length + k}
            label={upstream + "→" + downstream + " (" + phase + ")"}
            min={value.min}
            max={value.max}
            initialValue={value.value}
            onChange={handleChange} />
        );

        var numSpecies = props.species.length;
        if (j < numSpecies - 1 && k === numSpecies - 1) {
          sliders.push(<hr key={"line" + j} />);
        }
      });
    });

    var tabId = "speciesSpecies" + phase;

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

  var collapseId = "SpeciesSpeciesSliders";

  return (
    <div className="panel panel-default">
      <button
        type="button"
        className="btn btn-info"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + collapseId}>
          Species→species interactions
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

SpeciesSpeciesSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrices: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesSpeciesSliders;
