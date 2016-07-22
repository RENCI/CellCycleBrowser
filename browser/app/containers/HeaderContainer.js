// Controller-view for the header area

var React = require("react");
var PropTypes = React.PropTypes;
var DataSetStore = require("../stores/DataSetStore");
var Header = require("../components/Header");
var DataSetSelectContainer = require("../containers/DataSetSelectContainer");
var DataSetDescription = require("../components/DataSetDescription");

function getStateFromStore () {
  return {
    dataSetList: DataSetStore.getDataSetList(),
    dataSetDescription: DataSetStore.getDataSetDescription()
  };
}

var HeaderContainer = React.createClass({
  propTypes: {
    header: PropTypes.string.isRequired
  },
  getDefaultProps() {
    return {
      header: ""
    };
  },
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  componentWillUnmount: function() {
    DataSetStore.removeChangeListener(this.onDataSetChange);
  },
  onDataSetChange: function () {
    this.setState(getStateFromStore());
  },
  render: function () {
    return (
      <div className="jumbotron text-center">
        <div className="container-fluid">
          <Header
            header={this.props.header} />
          <DataSetSelectContainer
            dataSetList={this.state.dataSetList} />
          <DataSetDescription
            description={this.state.dataSetDescription} />
        </div>
      </div>
    );
  }
});

module.exports = HeaderContainer;
