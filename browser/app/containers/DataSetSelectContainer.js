var React = require("react");
var PropTypes = React.PropTypes;
var DataSetSelect = require("../components/DataSetSelect");
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
      <DataSetSelect
        label={this.props.label}
        dataSets={this.props.dataSets}
        onChangeDataSet={this.handleChangeDataSet} />
    );
  }
});

module.exports = DataSetSelectContainer;
