var React = require("react");
var PropTypes = React.PropTypes;

function MultiSelect(props) {
  function option(option, i) {
    // Use data-checked to save checked state and handle problems when embedded
    // in popover
    return (
      <li key={i}>
        <a className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={option.active}
              data-value={option.value}
              data-checked={option.active}
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

  return (
    <div>
      {props.label}
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
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  enabled: PropTypes.bool,
  onChange: PropTypes.func
};

MultiSelect.defaultProps = {
  enabled: true
};

module.exports = MultiSelect;
