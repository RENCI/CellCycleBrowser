var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var MapSelectContainer = React.createClass ({
  propTypes: {
    maps: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeMap: function (e) {
    ViewActionCreators.selectMap(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Map: "
        options={this.props.maps}
        onChange={this.handleChangeMap} />
    );
  }
});

module.exports = MapSelectContainer;
