var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var mapOption = function (map, i) {
  return {
    value: i,
    name: map.name
  };
}

var MapSelectContainer = React.createClass ({
  propTypes: {
    mapList: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeMap: function (e) {
    ViewActionCreators.selectMap(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Map: "
        options={this.props.mapList.map(mapOption)}
        onChange={this.handleChangeMap} />
    );
  }
});

module.exports = MapSelectContainer;
