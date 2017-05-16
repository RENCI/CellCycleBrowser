var React = require("react");
var PropTypes = React.PropTypes;
var MultiSelect = require("./MultiSelect");

var outerStyle = {
  marginTop: -1,
  marginBottom: -1
};

var tdStyle = {
  verticalAlign: "middle"
};

var labelStyle = {
  fontWeight: "normal !important"
};

function CellDataSelect(props) {
  function option(option, i) {
    var features = option.data.features.map(function (feature, i) {
      return {
        name: feature,
        value: option.data.name + ":" + feature,
        active: true
      };
    });

    return (
      <tr key={i}>
        <td style={tdStyle}>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                data-value={option.data.name} />
              {option.data.name}
            </label>
          </div>
        </td>
        <td className="small text-muted" style={tdStyle}>
          {option.data.description}
        </td>
        <td style={tdStyle}>
          <MultiSelect
            label="Features: "
            options={features} />
        </td>
        <td style={tdStyle}>
          <a
            href={'/cell_data_meta/' + option.data.fileName + '/'}
            target="_blank">
            metadata
          </a>
        </td>
      </tr>
    );
  }

  var popoverContentClass = "cellDataPopoverContent";

  return (
    <div style={outerStyle}>
      <strong>
        {"Data Sets: "}
      </strong>
      <button
        type="button"
        className="btn btn-default"
        data-toggle="popover"
        data-container="body"
        data-html="true"
        data-placement="bottom"
        data-popover-content={"." + popoverContentClass}>
        Select <span className="caret"></span>
      </button>
      <div className={"hidden " + popoverContentClass}>
        <table className={"table table-hover table-condensed " + props.popoverBodyClass}>
          <tbody>
            {props.options.map(option)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CellDataSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  popoverBodyClass: PropTypes.string.isRequired
};

module.exports = CellDataSelect;
