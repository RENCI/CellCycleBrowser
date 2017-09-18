var React = require("react");
var InteractionColorStore = require("../stores/InteractionColorStore");

var style = {
  width: 500
};

var colors = InteractionColorStore.getColorScale().range();

var lowColorStyle = {
  color: colors[0]
};

var highColorStyle = {
  color: colors[colors.length - 1]
};

function MapInformation() {
  return (
    <div style={style}>
      <h4>Map Visualization</h4>
      <p>The simulation model contains <b>expression levels per species</b>, <b>species to phase interactions</b>, and <b>species to species interactions per phase</b>.</p>
      <p>Each species is a circular node with size proportional to expression level (compared to the initial specified value). The species are replicated for each phase, and links between species and between species and phases indicate the interaction between those entities, color-mapped from <span style={lowColorStyle}>blue</span> (inhibiting) through grey to <span style={highColorStyle}>red</span> (promoting).</p>
      <p>Selecting a phase activates the controls tabs for that phase in the interaction panels below. Simulation parameters are controlled by sliders. You can control: a) the number of cells to simulate, b) the expression level of each species, c) species to phase interaction parameters, and d) species to species interaction parameters per phase. Each slider group can be collapsed by clicking the header for that group. Interaction slider handles are colored to match the links in the map visualization.</p>
      <p>Click the <i>Run simulation</i> button to run the simulation. A red cancel button will become available to cancel the run if it is taking too long. Any simulation errors will appear in a red box below the Run Simulation button.</p>
    </div>
  );
}

module.exports = MapInformation;
