var React = require("react");
var PropTypes = React.PropTypes;

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5,
};

var toolBarStyle ={
  marginLeft: -6,
  marginRight: -1,
  marginTop: -1,
  marginBottom: -1
};

var rightStyle = {
  float: "right"
};

var iconStyle = {
  color: "#aaa",
  pointerEvents: "none"
};

function TrackSort(props) {
  function handleClick(e) {
    props.onClick(e.target.dataset.value);
  }

  return (
    <div style={outerStyle}>
      <div className="btn-toolbar" style={toolBarStyle}>
        <div className="btn-group" data-toggle="buttons">
          <label
            className="btn btn-default btn-xs"
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="species"
            title="Sort by species"
            onClick={handleClick}>
              <span
                className="glyphicon glyphicon-sort"
                style={iconStyle}>
              </span>
          </label>
          <label
            className="btn btn-default btn-xs"
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="feature"
            title="Sort by feature"
            onClick={handleClick}>
              <span
                className="glyphicon glyphicon-sort"
                style={iconStyle}>
              </span>
          </label>
        </div>
        <div className="btn-group" data-toggle="buttons" style={rightStyle}>
          <label
            className="btn btn-default btn-xs"
            data-toggle="tooltip"
            data-container="body"
            data-placement="auto top"
            data-value="source"
            title="Sort by data source"
            onClick={handleClick}>
              <span
                className="glyphicon glyphicon-sort"
                style={iconStyle}>
              </span>
          </label>
        </div>
      </div>
    </div>
  );
}

TrackSort.propTypes = {
  onClick: PropTypes.func.isRequired
};

module.exports = TrackSort;
