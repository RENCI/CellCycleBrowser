var React = require("react");
var PropTypes = React.PropTypes;
var ToggleButton = require("./ToggleButton");
var ViewActionCreators = require("../actions/ViewActionCreators");

function handleClick(e) {
  console.log(e);
}

function button(d, i) {
  return (
    <div key={i} style={{width: "100%"}}>
      <ToggleButton
        selected={i % 2 === 0}
        onClick={onClick} />
    </div>
  );
}

function TrackToggleButtons(props) {
  var style = {
    width: props.height,
    height: props.height,
    marginLeft: "auto",
    marginRight: -16
  };

  var buttons = props.data.map(function (d, i) {
    return (
      <div key={i} style={style}>
        <ToggleButton
          selected={i % 2 === 0}
          height={props.height}
          onClick={handleClick} />
      </div>
    );
  });

  return (
    <div style={{marginTop: -1}}>
      {buttons}
    </div>
  );
}

TrackToggleButtons.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired
};

module.exports = TrackToggleButtons;
