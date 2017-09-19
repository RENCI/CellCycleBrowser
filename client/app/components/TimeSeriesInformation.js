var React = require("react");
var InformationWrapper = require("./InformationWrapper");

function TimeSeriesInformation() {
  return (
    <InformationWrapper>
      <h4>Time Series Analysis Plot</h4>
      <p>This plot shows a line plot for each selected <b>trace</b> from the <i>Data Browser</i>. Average traces are drawn slightly thicker than individual cell traces. The color for each track matches the <i>Track color</i> icons in the <i>Data Browser</i>.</p>
      <p>The alignment and trace rescaling settings from the <i>Data Browser</i> are used for the time series analysis plot. Mouseover any individual line plot to highlight it.</p>
    </InformationWrapper>
  );
}

module.exports = TimeSeriesInformation;
