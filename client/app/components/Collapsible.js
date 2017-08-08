var React = require("react");
var PropTypes = React.PropTypes;

var buttonStyle = {
  width: "100%",
  marginTop: -1
};

var collapseStyle = {
  marginLeft: 10,
  marginRight: 10
};

function Collapsible(props) {
  return (
    <div>
      <button
        type="button"
        className="btn btn-default"
        style={buttonStyle}
        data-toggle="collapse"
        data-target={"#" + props.id}
        onClick={props.onCollapse}>
          {props.label}
      </button>
      <div className="in" id={props.id} style={collapseStyle}>
        {props.children}
      </div>
    </div>
  );
}

Collapsible.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onCollapse: PropTypes.func
};

module.exports = Collapsible;
