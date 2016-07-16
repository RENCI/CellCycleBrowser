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

function CellLineSelect(props) {
  return (
    <div>
      <p style={marginTop}>
        <lead>Cell line: </lead>
        <select
          className="form-control"
          style={minWidth}
          onChange={props.onChangeCellLine}>
            {props.cellLines.map(option)}
        </select>
      </p>
    </div>
  );
}

CellLineSelect.propTypes = {
  label: PropTypes.string.isRequired,
  cellLines: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChangeCellLine: PropTypes.func.isRequired
};

module.exports = CellLineSelect;
