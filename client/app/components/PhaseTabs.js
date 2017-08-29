var React = require("react");
var PropTypes = React.PropTypes;
var ViewActionCreators = require("../actions/ViewActionCreators");
var d3 = require("d3");
var d3ScaleChromatic = require("d3-scale-chromatic");

var tabStyle = {
  marginTop: 5
};

function PhaseTabs(props) {
  // TODO: Move to global settings somewhere
  var colorScale = d3.scaleOrdinal(d3ScaleChromatic.schemeAccent)
      .domain(props.phases);

  var colorBlendScale = d3.scaleLinear()
      .domain([0, 1]);

  var tabs = props.phases.map(function(phase, i) {
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
            {props.children[i]}
        </div>
      )
    };
  });

  return (
    <div>
      <ul className="nav nav-tabs" style={{tabStyle}}>
        {tabs.map(function(tab) { return tab.tab; })}
      </ul>
      <div className="tab-content">
        {tabs.map(function(tab) { return tab.content; })}
      </div>
    </div>
  );
}

PhaseTabs.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.string).isRequired,
  activePhase: PropTypes.string.isRequired
};

module.exports = PhaseTabs;
