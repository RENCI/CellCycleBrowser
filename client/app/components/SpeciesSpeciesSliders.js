var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

function SpeciesSpeciesSliders(props) {
  if (props.species.length <= 1) return null;

  // TODO: Move to global settings somewhere
  var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(props.phases);

  // TODO: Move to global settings somewhere
  var linkColorScale = d3.scaleLinear()
      .domain([-1, -Number.EPSILON, 0, Number.EPSILON, 1])
      .range(["#00d", "#bbd", "#ccc", "#dbb", "#d00"]);

  var tabs = props.phases.map(function (phase, i) {
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
            <div className="text-left" style={{width: 50, marginLeft: 5}}>
              <label>{downstream}</label>
            </div>
          </div>
        );

        var numSpecies = props.species.length;
        if (j < numSpecies - 1 && k === numSpecies - 1) {
          sliders.push(
            <hr
              key={"line" + j}
              style={{marginTop: 5, marginBottom: 10}} />
          );
        }
      });
    });

    var tabId = "speciesSpecies" + phase;
    var active = (props.activePhase === "" && i === 0) || phase === props.activePhase;

    return {
      tab: (
        <li className={"nav" + (active ? " active" : "")} key={i}>
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
      id="speciesSpeciesSliders"
      label="Species→species interactions">
        <ul className="nav nav-tabs" style={{marginTop: 5}}>
          {tabs.map(function(tab) { return tab.tab; })}
        </ul>
        <div className="tab-content">
          {tabs.map(function(tab) { return tab.content; })}
        </div>
    </Collapsible>
  );
}

SpeciesSpeciesSliders.propTypes = {
  species: PropTypes.arrayOf(PropTypes.string).isRequired,
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrices: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = SpeciesSpeciesSliders;
