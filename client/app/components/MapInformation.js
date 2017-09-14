var React = require("react");

var style = {
  width: 500
};

function MapInformation() {
  return (
    <div style={style}>
      <h4>Map Visualization</h4>
      The simulation model contains expression levels per species, species to phase interactions, and species to species interactions per phase. The map visualization represents each species as a circular node, with size proportional to expression level (compared to the initial specified value). The species are replicated for each phase, and links between species and between species and phases indicate the interaction between those entities, color-mapped from blue (inhibiting) through grey to red (promoting). Selecting a phase activates the tabs for the controls for that phase in the interaction panels below. Simulation parameters are controlled by sliders. The user can control: a) the number of cells to simulate, b) the expression level of each species, c) species to phase interaction parameters, and d) species to species interaction parametersper phase. Interaction slider handles are colored to match the links in the map visualization. When running the simulation, a red cancel button is available so users can cancel the run when the simulation is taking too long.
    </div>
  );
}

module.exports = MapInformation;
