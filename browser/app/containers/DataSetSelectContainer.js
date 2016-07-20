var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var DataSetSelectContainer = React.createClass ({
  propTypes: {
    dataSets: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeDataSet: function (e) {
    ViewActionCreators.selectDataSet(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Data set: "
        options={this.props.dataSets}
        onChange={this.handleChangeDataSet} />
    );
  }
});

module.exports = DataSetSelectContainer;
