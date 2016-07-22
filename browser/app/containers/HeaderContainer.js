// Controller-view for the header area

var React = require("react");
var PropTypes = React.PropTypes;
var DataSetListStore = require("../stores/DataSetListStore");
var DataSetStore = require("../stores/DataSetStore")
var Header = require("../components/Header");
var DataSetSelectContainer = require("../containers/DataSetSelectContainer");
var DataSetDescription = require("../components/DataSetDescription");

function getStateFromStores () {
  return {
    dataSetList: DataSetListStore.getDataSetList(),
    dataSet: DataSetStore.getDataSet()
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
    return getStateFromStores();
  },
  componentDidMount: function () {
    DataSetListStore.addChangeListener(this.onDataSetListChange);
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  componentWillUnmount: function() {
    DataSetListStore.removeChangeListener(this.onDataSetListChange);
    DataSetStore.addChangeListener(this.onDataSetChange);
  },
  onDataSetListChange: function () {
    this.setState(getStateFromStores());
  },
  onDataSetChange: function () {
    this.setState(getStateFromStores());
  },
  render: function () {
    var description = this.state.dataSet.description ?
                      this.state.dataSet.description :
                      "";

    return (
      <div className="jumbotron text-center">
        <div className="container-fluid">
          <Header
            header={this.props.header} />
          <DataSetSelectContainer
            dataSetList={this.state.dataSetList} />
          <DataSetDescription
            description={description} />
        </div>
      </div>
    );
  }
});

module.exports = HeaderContainer;
