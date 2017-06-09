var React = require("react");
var TrackSortButton = require("./TrackSortButton");
var ViewActionCreators = require("../actions/ViewActionCreators");

var outerStyle = {
  backgroundColor: "white",
  borderColor: "#ccc",
  borderStyle: "solid",
  borderWidth: 1,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 5,
};

var toolBarStyle = {
  marginLeft: -6,
  marginRight: -1,
  marginTop: -1,
  marginBottom: -1
};

var rightStyle = {
  float: "right"
};

var labelStyle = {
  marginTop: 5,
  marginBottom: 5
};

function TrackSort(props) {
  function handleClick(e) {
    ViewActionCreators.sortTracks(e.target.dataset.value);
  }

  return (
    <div style={outerStyle}>
      <div className="btn-toolbar" style={toolBarStyle}>
        <div className="btn-group" data-toggle="buttons">
          <TrackSortButton
            value="species"
            toolTip="Sort by species"
            onClick={handleClick} />
          <TrackSortButton
            value="feature"
            toolTip="Sort by feature"
            onClick={handleClick} />
        </div>
        <label style={labelStyle}>Sort tracks</label>
        <div className="btn-group" data-toggle="buttons" style={rightStyle}>
          <TrackSortButton
            value="source"
            toolTip="Sort by data source"
            onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}

module.exports = TrackSort;
