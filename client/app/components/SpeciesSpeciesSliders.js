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
  var tabs = props.model.phases.map(function(phase, i) {
    var sliders = [];
    for (var j = 0; j < props.model.species.length; j++) {
      var upstream = props.model.species[j];
      for (var k = 0; k < props.model.species.length; k++) {
        if (k === j) continue;

        var downstream = props.model.species[k];

        function handleChange(value) {
          props.onChange({
            phase: phase,
            upstream: upstream,
            downstream: downstream,
            value: value
          });
        }

        sliders.push(
          <SliderContainer
            key={j * props.model.species.length + k}
            label={upstream.name + "→" + downstream.name + " (" + phase.name + ")"}
            min={-1}
            max={1}
            initialValue={props.model.speciesMatrices[i][j][k]}
            onChange={handleChange} />
        );
      }
    }

    var tabId = "speciesSpecies" + phase.name;

    return {
      tab: (
        <li className={"nav" + (i === 0 ? " active" : "")} key={i}>
          <a href={"#" + tabId} data-toggle="tab">{phase.name}</a>
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
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesSpeciesSliders;
