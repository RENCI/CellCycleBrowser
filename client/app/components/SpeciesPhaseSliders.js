var React = require("react");
var PropTypes = React.PropTypes;
var Collapsible = require("../components/Collapsible");
var ValueSliderContainer = require("../containers/ValueSliderContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

var tabStyle = {
  marginTop: 5
};

var labelStyle = {
  width: 80,
  marginRight: 5
};

var valueStyle = {
  width: 20,
  marginRight: 5
};

function valueLabel(value) {
  return Math.round(value.value);
}

function SpeciesPhaseSliders(props) {
  // TODO: Move to global settings somewhere
  var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(props.phases);

  var colorBlendScale = d3.scaleLinear()
      .domain([0, 1]);

  // TODO: Move to global settings somewhere
  var epsilon = Number.EPSILON;
  var linkColorScale = d3.scaleLinear()
      .domain([-10, -epsilon, 0, epsilon, 10])
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
          <div className="text-right" style={labelStyle}>
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
          <div className="text-right" style={valueStyle}>
            <label>{valueLabel(value)}</label>
          </div>
        </div>
      );
    });

    var tabId = "speciesPhase" + phase;

    // XXX: Select a tab index if phase is currently not selected to force
    // a render of tabs to size sliders correctly. Should probably keep this
    // logic separate and add a container to keep the tab state.
    var activeIndex = +props.activePhase;
    var active = (props.activePhase === "" && i === 0) ||
                 (i === activeIndex) ||
                 phase === props.activePhase;

    var color = colorScale(phase);
    colorBlendScale.range(["white", color]);

    function onClick() {
      if (props.activePhase === "" || !isNaN(activeIndex)) {
        ViewActionCreators.selectPhase(i + "");
      }
      else {
        ViewActionCreators.selectPhase(phase);
      }
    }

    return {
      tab: (
        <li
          key={i}
          className={"nav" + (active ? " active" : "")}
          onClick={onClick}>
            <a
              href={"#" + tabId}
              data-toggle="tab"
              style={{
                borderLeft: "2px solid " + color,
                borderTop: "2px solid " + color,
                borderRight: "2px solid " + color,
                backgroundColor: active ? colorBlendScale(0.5) : "white",
                color: "black"
              }}>
                {phase}
            </a>
        </li>
      ),
      content: (
        <div
          key={i}
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
          }}>
            {sliders}
        </div>
      )
    };
  });

  return (
    <Collapsible
      id="speciesPhaseSliders"
      label="Species→phase interactions"
      onCollapse={props.onCollapse}>
        <ul className="nav nav-tabs" style={{tabStyle}}>
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
  onChange: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired
};

module.exports = SpeciesPhaseSliders;
