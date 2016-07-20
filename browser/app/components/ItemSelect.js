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

function ItemSelect(props) {
  var options = props.options.map(function(option, i) {
    return <option
             key={i}
             value={option.value}>
               {option.name}
           </option>
  });

  return (
    <div>
      <p style={marginTop}>
        <lead>{props.label}</lead>
        <select
          className="form-control"
          style={minWidth}
          onChange={props.onChange}>
            {options}
        </select>
      </p>
    </div>
  );
}

ItemSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ItemSelect;
