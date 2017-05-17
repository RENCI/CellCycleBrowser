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

function DatasetSelect(props) {
  function option(option, i) {
    var features = option.features ?
      option.features.map(function (feature, i) {
        return {
          name: feature.name,
          value: option.name + ":" + feature,
          active: feature.active
        };
      }) : [];

    return (
      <tr key={i}>
        <td style={tdStyle}>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                defaultChecked={option.active}
                data-value={option.name} />
              {option.name}
            </label>
          </div>
        </td>
        <td className="small text-muted" style={tdStyle}>
          {option.description}
        </td>
        <td style={tdStyle}>
          <MultiSelect
            label="Features: "
            options={features} />
        </td>
        <td style={tdStyle}>
          <a
            href={'/cell_data_meta/' + option.fileName + '/'}
            target="_blank">
            metadata
          </a>
        </td>
      </tr>
    );
  }

  var popoverContentClass = "datasetPopoverContent";

  return (
    <div style={outerStyle}>
      <strong>
        {"Datasets: "}
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

DatasetSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  popoverBodyClass: PropTypes.string.isRequired
};

module.exports = DatasetSelect;
