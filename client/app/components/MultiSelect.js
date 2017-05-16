var React = require("react");
var PropTypes = React.PropTypes;

var checkboxStyle = {
  marginLeft: 20
};

function MultiSelect(props) {
  function option(option, i) {
    return (
      <li key={i}>
        <a className="checkbox" style={checkboxStyle}>
          <input
            type="checkbox"
            defaultChecked={option.active}
            data-value={option.value}
            onChange={option.onChange} />
          {option.name}
        </a>
      </li>
    );
  }

  return (
    <div>
      {props.label}
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown">
            Select <span className="caret"></span>
        </button>
        <ul className="dropdown-menu dropdown-menu-form">
          {props.options.map(option)}
        </ul>
      </div>
    </div>
  );
}

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func
};

module.exports = MultiSelect;
