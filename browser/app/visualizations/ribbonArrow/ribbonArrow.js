var slice = require("./array").slice;
var constant = require("./constant");
var math = require("./math");
var cos = math.cos;
var halfPi = math.halfPi;
var sin = math.sin;
var d3 = require("d3");
var path = d3.path;

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

function defaultArrowHeight(d) {
  return 1.0;
}

function defaultArrowWidth(d) {
  return 0.5;
}

module.exports = function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      arrowHeight = defaultArrowHeight,
      arrowWidth = defaultArrowWidth,
      context = null;

  function ribbonArrow() {
    var buffer,
        argv = slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        sx0 = sr * cos(sa0),
        sy0 = sr * sin(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = path();

    var ah = +arrowHeight.apply(this, (argv[0] = s, argv)),
        aw = +arrowWidth.apply(this, (argv[0] = s, argv));
/*
    var sarrow = arrow(sr, sa0, sa1),
        tarrow = arrow(tr, ta0, ta1);

    function arrow(r, a0, a1) {
      return {
        aDiff
      };
    }

    {
      aDiff = Math.abs(sa0 - sa1),
      w = sr * saDiff,

    };
*/
    saMid = (sa0 + sa1) / 2
    saDiff = Math.abs(sa0 - sa1),
    sw = sr * saDiff,
    sarr = sr - sw * ah,

    sx1 = (sr - sw * ah) * cos(sa1 + saDiff * 0.5),
    sy1 = (sr - sw * ah) * sin(sa1 + saDiff * 0.5),
    sx2 = (sr - sw * ah) * cos(sa1),
    sy2 = (sr - sw * ah) * sin(sa1);

    context.moveTo(sr * cos(saMid), sr * sin(saMid));
    context.lineTo(sx1, sy1)
    context.lineTo(sx2, sy2);
    if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
      context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
      context.arc(0, 0, tr, ta0, ta1);
    }
    context.quadraticCurveTo(0, 0, sx0, sy0);
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  ribbonArrow.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbonArrow) : radius;
  };

  ribbonArrow.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbonArrow) : startAngle;
  };

  ribbonArrow.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbonArrow) : endAngle;
  };

  ribbonArrow.arrowHeight = function(_) {
    return arguments.length ? (arrowHeight = typeof _ === "function" ? _ : constant(+_), ribbonArrow) : arrowHeight;
  };

  ribbonArrow.arrowWidth = function(_) {
    return arguments.length ? (arrowWidth = typeof _ === "function" ? _ : constant(+_), ribbonArrow) : arrowWidth;
  };

  ribbonArrow.source = function(_) {
    return arguments.length ? (source = _, ribbonArrow) : source;
  };

  ribbonArrow.target = function(_) {
    return arguments.length ? (target = _, ribbonArrow) : target;
  };

  ribbonArrow.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbonArrow) : context;
  };

  return ribbonArrow;
}
