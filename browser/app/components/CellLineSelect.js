var React = require("react");
var PropTypes = React.PropTypes;

function option(v, i) {
  return <option
           key={i}
           value={v.value}>
             {v.name}
         </option>
}

var minWidth = {
  minWidth: 0,
  width: "auto",
  display: "inline"
};

function CellLineSelect(props) {
  return (
    <div>
      <h2>Cell line: </h2>
      <select
        className="form-control"
        style={minWidth}
        onChange={props.onChangeCellLine}>
          {props.cellLines.map(option)}
      </select>
    </div>
  );
}

CellLineSelect.propTypes = {
  label: PropTypes.string.isRequired,
  cellLines: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangeCellLine: PropTypes.func.isRequired
};

module.exports = CellLineSelect;
