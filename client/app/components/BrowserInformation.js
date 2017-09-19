var React = require("react");
var InformationWrapper = require("./InformationWrapper");

function BrowserInformation() {
  return (
    <InformationWrapper>
      <h4>Data Browser</h4>
      <p>The data browser shows both experimental data and the output of the current simulation run. Multiple experimental datasets can be selected from the <i>Datasets</i> dropdown above.</p>
      <p>The browser separates data into different <b>tracks</b>, where each track is defined by a data <b>source</b> (the dataset or simulation), a <b>species</b>, and a <b>feature</b> (for experimental data). Each track displays individual cells as separate <b>traces</b>, with the average of all traces for the track shown at the top. You can show only the average for each track by clicking the <i>collapse button</i>.</p>
      <p>There are two types of tracks: <b>data</b> tracks, showing color-mapped values from white (low) to black (high), and <b>phase</b> tracks, showing colored phase bars representing the temporal extent of each phase.</p>
      <p>You can <b>left-align</b>, <b>right-align</b>, or <b>fully-justify</b> the traces with the <i>alignment buttons</i> at the top. The <i>time line</i> below the <i>alignment buttons</i> will update to show the appropriate temporal information.</p>
      <p>You can sort tracks by <b>type</b> (data or phase), <b>species</b>, <b>feature</b>, or <b>source</b> using the <i>Sort tracks</i> buttons. You can also click and drag the header of each track to arrange them manually.</p>
      <p>Click the <i>Toggle time series display</i> button next to each trace to toggle display in the <i>Time Series Analysis Plot</i>, if present. For data tracks with associated phase data, you can click the <i>Show phase overlay</i> button to overlay phase information for that track. By default the color map for each track is set to the data range across all traces in that track. You can rescale the color map per trace with the <i>Rescale traces</i> button. The <i>Source color</i> and <i>Track color</i> icons indicate the colors for this source/track used in any <i>Analysis Plots</i>.</p>
    </InformationWrapper>
  );
}

module.exports = BrowserInformation;
