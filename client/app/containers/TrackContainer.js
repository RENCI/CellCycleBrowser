var React = require("react");
var PropTypes = React.PropTypes;
var Track = require("../components/Track");

var TrackContainer = React.createClass ({
  propTypes: {
    track: PropTypes.object.isRequired,
    phases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    phaseAverage: PropTypes.arrayOf(PropTypes.object).isRequired,
    timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired,
    activePhases: PropTypes.arrayOf(PropTypes.object).isRequired,
    activePhase: PropTypes.string.isRequired,
    phaseColorScale: PropTypes.func.isRequired,
    phaseOverlayOpacity: PropTypes.number.isRequired
  },
  getInitialState: function () {
    return {
      scaleAll: true
    };
  },
  handleClickScaleAll: function () {
    this.setState({
      scaleAll: !this.state.scaleAll
    });
  },
  render: function () {
    return (
      <Track
        {...this.props}
        scaleAll={this.state.scaleAll}
        onClickScaleAll={this.handleClickScaleAll} />
    );
  }
});

module.exports = TrackContainer;
