var React = require("react");
var PropTypes = React.PropTypes;

function MultiSelect(props) {
  var numActive = props.options.reduce(function (p, c) {
    return p + (c.active ? 1 : 0);
  }, 0);

  function option(option, i) {
    return (
      <li key={i}>
        <a className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={option.active}
              disabled={option.active && numActive <= props.minSelected}
              data-value={option.value}
              onChange={props.onChange} />
            {option.name}
          </label>
        </a>
      </li>
    );
  }

  function handleClick(e) {
    // Prevent closing of dropdown
    e.stopPropagation();
  }

  var label = props.labelStrong ?
              <strong>{props.label}</strong> :
              props.label;

  return (
    <div>
      {label}
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          disabled={!props.enabled}>
            Select <span className="caret"></span>
        </button>
        <ul
          className="dropdown-menu dropdown-menu-form"
          onClick={handleClick}>
            {props.options.map(option)}
        </ul>
      </div>
    </div>
  );
}

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  labelStrong: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  enabled: PropTypes.bool,
  minSelected: PropTypes.number,
  onChange: PropTypes.func
};

MultiSelect.defaultProps = {
  labelStrong: true,
  enabled: true,
  minSelected: 0
};

module.exports = MultiSelect;
