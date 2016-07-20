var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var UserActionCreators = require("../actions/UserActionCreators");

var DataSetSelectContainer = React.createClass ({
  propTypes: {
    label: PropTypes.string.isRequired,
    dataSets: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeDataSet: function (e) {
    UserActionCreators.selectDataSet(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label={this.props.label}
        options={this.props.dataSets}
        onChange={this.handleChangeDataSet} />
    );
  }
});

module.exports = DataSetSelectContainer;
