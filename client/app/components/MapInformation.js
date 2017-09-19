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
      <p>The map visualization is a network visualization of the simulation model, which contains <b>expression levels per species</b>, <b>species to phase interactions</b>, and <b>species to species interactions per phase</b>.</p>
      <p>Each species is a circular node with size proportional to expression level (as a fold change compared to the initial value specified in the model). The species are replicated for each phase to show how their relationships evolve over time. Links between species and between species and transition lines between phases indicate the interaction between those entities, color-mapped from <span style={lowColorStyle}>blue</span> (inhibiting) through grey to <span style={highColorStyle}>red</span> (promoting), with magnitude mapped to width.</p>
      <p>Mouseover any species to highlight all interactions with that species, mouseover any link to show all interactions between those species (or that species and all phases), and mouseover any transition line to show all interactions with any phase.</p>
      <p>Select a phase to activate the control tabs for that phase in the <i>interactions</i> panels below. Simulation parameters are controlled by sliders. You can control: a) the <i>Number of cells</i> to simulate, b) the species <i>Expression levels</i>, c) <i>Species→phase interactions</i>, and d) <i>Species→species interactions</i> per phase. Each control panel can be collapsed by clicking the header for that panel. Interaction slider handles are colored to match the links in the map visualization.</p>
      <p>Click the <i>Run simulation</i> button to run the simulation. A red cancel button will become available to cancel the run if it is taking too long. Any simulation errors will appear in a red box below the <i>Run simulation</i> button.</p>
    </div>
  );
}

module.exports = MapInformation;
