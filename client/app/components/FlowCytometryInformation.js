var React = require("react");
var InformationWrapper = require("./InformationWrapper");

function FlowCytometryInformation() {
  return (
    <InformationWrapper>
      <h4>Cell Cycle Analysis Plot</h4>
      <p>A simulated flow cytometry plot is shown for each data <b>source</b> represented in the <i>Data Browser</i> that contains phase information. Each data point represents an individual cell, with phase generated probabilistically based on the average phase lengths for that data <b>source</b>.</p>
      <p>Each cell is colored based on the density of cells around it, with the color map matching the <i>Source color</i> icons for each track in the <i>Data Browser</i></p>
    </InformationWrapper>
  );
}

module.exports = FlowCytometryInformation;
