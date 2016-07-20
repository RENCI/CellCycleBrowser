var React = require("react");
var PropTypes = React.PropTypes;

function option(v, i) {
  return <option
           key={i}
           value={v.value}>
             {v.name}
         </option>
}

var marginTop = {
  marginTop: "40px"
};

var minWidth = {
  minWidth: 0,
  width: "auto",
  display: "inline"
};

function DataSetSelect(props) {
  return (
    <div>
      <p style={marginTop}>
        <lead>Data set: </lead>
        <select
          className="form-control"
          style={minWidth}
          onChange={props.onChangeDataSet}>
            {props.dataSets.map(option)}
        </select>
      </p>
    </div>
  );
}

DataSetSelect.propTypes = {
  label: PropTypes.string.isRequired,
  dataSets: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangeDataSet: PropTypes.func.isRequired
};

module.exports = DataSetSelect;
