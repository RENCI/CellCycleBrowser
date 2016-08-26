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
  return d.arrowHeight;
}

function defaultArrowWidth(d) {
  return d.arrowWidth;
}

function defaultLeftArrow(d) {
  return d.leftArrow;
}

function defaultRightArrow(d) {
  return d.rightArrow;
}

function arrow(r, a0, a1, left, right) {
  var aDiff = Math.abs(a0 - a1),
      aMid = (a0 + a1) / 2,
      w = r * aDiff,
      ar = r - w * ah,
      x = aDiff * aw - aDiff;
      points = [];

  if (left) {
    points.push({
      x: ar * cos(a0),
      y: ar * sin(a0),
    });

    points.push({
      x: ar * cos(a0 - x),
      y: ar * sin(a0 - x)
    });

    if (right) {
      points.push({
        x: r * cos(aMid),
        y: r * sin(aMid)
      });

      points.push({
        x: ar * cos(a1 + x),
        y: ar * sin(a1 + x)
      });

      points.push({
        x: ar * cos(a1),
        y: ar * sin(a1),
      });
    }
    else {
      points.push({
        x: r * cos(a1),
        y: r * sin(a1),
      });
    }
  }
  else {
    points.push({
      x: r * cos(a0),
      y: r * sin(a0)
    });

    points.push({
      x: ar * cos(a1 + aDiff * aw / 2),
      y: ar * sin(a1 + aDiff * aw / 2)
    });

    points.push({
      x: ar * cos(a1),
      y: ar * sin(a1),
    });
  }

  return points;
}

module.exports = function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      arrowHeight = defaultArrowHeight,
      arrowWidth = defaultArrowWidth,
      leftArrow = defaultLeftArrow,
      rightArrow = defaultRightArrow,
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
        ta1 = endAngle.apply(this, argv) - halfPi
        ah = +arrowHeight.apply(this, argv),
        aw = +arrowWidth.apply(this, argv),
        sla = leftArrow.apply(this, (argv[0] = s, argv)),
        sra = rightArrow.apply(this, (argv[0] = s, argv)),
        tla = leftArrow.apply(this, (argv[0] = t, argv)),
        tra = rightArrow.apply(this, (argv[0] = t, argv));

    if (!context) context = buffer = path();

    var sarrow = [];

    // Source arrow or arc
    if (sla || sra) {
      sarrow = arrow(sr, sa0, sa1, sla, sra);

      context.moveTo(sarrow[0].x, sarrow[0].y);
      for (var i = 1; i < sarrow.length; i++) {
        context.lineTo(sarrow[i].x, sarrow[i].y);
      }
    }
    else {
      context.moveTo(sx0, sy0);
      context.arc(0, 0, sr, sa0, sa1);
    }

    // Curve and target arrow or arc
    if (tla || tra) {
      var tarrow = arrow(tr, ta0, ta1, tla, tra);

      context.quadraticCurveTo(0, 0, tarrow[0].x, tarrow[0].y);
      for (var i = 1; i < tarrow.length; i++) {
        context.lineTo(tarrow[i].x, tarrow[i].y);
      }
    }
    else {
      context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
      context.arc(0, 0, tr, ta0, ta1);
    }

    // Curve back
    if (sarrow.length > 0) {
      context.quadraticCurveTo(0, 0, sarrow[0].x, sarrow[0].y);
    }
    else {
      context.quadraticCurveTo(0, 0, sx0, sy0);
    }

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

  ribbonArrow.leftArrow = function(_) {
    return arguments.length ? (leftArrow = typeof _ === "function" ? _ : constant(_ == true), ribbonArrow) : leftArrow;
  };

  ribbonArrow.rightArrow = function(_) {
    return arguments.length ? (rightArrow = typeof _ === "function" ? _ : constant(_ == true), ribbonArrow) : rightArrow;
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
