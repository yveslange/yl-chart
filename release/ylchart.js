(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("ylchart/app", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  config: require('ylchart/config'),
  tools: require('ylchart/utils/tools'),
  scale: require('ylchart/utils/scale'),
  domain: require('ylchart/utils/domain'),
  palette: require('ylchart/utils/palette'),
  design: require('ylchart/utils/design'),
  effectsPoint: require('ylchart/effects/point'),
  title: require('ylchart/components/title'),
  tooltip: require('ylchart/components/tooltip'),
  logo: require('ylchart/components/logo'),
  legend: require('ylchart/components/legend'),
  cross: require('ylchart/components/cross'),
  axis: require('ylchart/components/axis'),
  grid: require('ylchart/components/grid'),
  label: require('ylchart/components/label'),
  plugin: require('ylchart/components/plugin')
};

exp.Main = Main = (function() {
  function Main(args) {
    this._CONF = new M.config.Main(args.config).get();
    this._PALETTE = new M.palette.Main(this._CONF.point.color);
    this._SVG = void 0;
    this._CLASS = {
      tooltip: void 0,
      title: void 0
    };
    this._SERIES = M.tools.prepareSeries({
      series: args.series,
      palette: this._PALETTE,
      confPoint: this._CONF.point
    });
    if (this._CONF.canvas.padding === 'auto') {
      this._CONF.canvas.padding = M.design.computePadding(this._CONF.point);
    }
    this._DOMAIN = M.domain.computeDomain(args.series);
    M.domain.fixDomain({
      domain: this._DOMAIN,
      confDomain: this._CONF.domain
    });
    this._SCALE = M.scale.computeScales({
      confCanvas: this._CONF.canvas,
      confAxis: this._CONF.axis,
      confGrid: this._CONF.grid,
      domain: this._DOMAIN
    });
    this.initSVG(this._CONF.canvas);
  }

  Main.prototype.toString = function() {
    console.log("Canvas in " + this._CONF.selector);
    console.log("Config", this._CONF);
    console.log("Classes:", this._CLASS);
    console.log("Series:", this._SERIES);
  };

  Main.prototype.initSVG = function(confCanvas) {
    if (confCanvas.selector == null) {
      throw new Error("No selector defined");
    }
    if (!document.querySelector(confCanvas.selector)) {
      throw new Error("Element '" + confCanvas.selector + "' doesn't exists");
    }
    $(confCanvas.selector).css({
      "position": "relative"
    });
    this._SVG = d3.select(confCanvas.selector).append('svg').attr("fill", confCanvas.bgcolor).attr('width', confCanvas.width).attr('height', confCanvas.height);
    this._CLASS.tooltip = new M.tooltip.Main(this._CONF.canvas.selector);
    this._CLASS.plugin = new M.plugin.Main(this._CONF.canvas.selector);
    this._CLASS.logo = new M.logo.Main(this._SVG);
    this._CLASS.gridX = new M.grid.Main(this._SVG);
    this._CLASS.gridY = new M.grid.Main(this._SVG);
    this._CLASS.labelX = new M.label.Main(this._SVG);
    this._CLASS.labelY = new M.label.Main(this._SVG);
    this._CLASS.axisX = new M.axis.Main(this._SVG);
    this._CLASS.axisY = new M.axis.Main(this._SVG);
    this._CLASS.cross = new M.cross.Main(this._SVG);
    this._CLASS.legend = new M.legend.Main(this._SVG);
    return this._CLASS.title = new M.title.Main(this._SVG);
  };

  Main.prototype.renderPoints = function() {
    var scaleH, scaleW, series, valueline, _canvas, _conf, _effectOut, _effectOver, _scope, _tooltipCallback, _tooltipHide, _tooltipNode, _tooltipShow, _tooltipTemplate;
    _scope = this;
    _conf = this._CONF;
    _canvas = this._SVG;
    _tooltipNode = this._CLASS.tooltip.getDOM().root;
    _tooltipShow = this._CLASS.tooltip.show;
    _tooltipHide = this._CLASS.tooltip.hide;
    _tooltipCallback = _conf.tooltip.callback;
    _tooltipTemplate = _conf.tooltip.template;
    _effectOver = _conf.point.onMouseover;
    _effectOut = _conf.point.onMouseout || _effectOver;
    if (typeof _effectOver === 'string') {
      _effectOver = M.effectsPoint[_effectOver].onMouseover;
    }
    if (typeof _effectOut === 'string') {
      _effectOut = M.effectsPoint[_effectOut].onMouseout;
    }
    if (typeof _tooltipCallback === "string") {
      _tooltipCallback = this._CLASS.tooltip.getCallback(_tooltipCallback);
    }
    if (typeof _tooltipTemplate === "string") {
      _tooltipTemplate = this._CLASS.tooltip.getTemplate(_tooltipTemplate);
    }
    scaleW = this._SCALE.x;
    scaleH = this._SCALE.y;
    series = this._SVG.selectAll(".series").data(this._SERIES).enter().append("g").attr("class", "series").attr("id", function(s, i) {
      return "" + i;
    }).attr("title", function(s) {
      return s.name;
    });
    if (_conf.canvas.render === 'line' || _conf.canvas.render === 'dotline') {
      valueline = d3.svg.line().interpolate("linear").x(function(d) {
        return scaleW(d.x);
      }).y(function(d) {
        return scaleH(d.y);
      });
      series.append("path").attr("class", "line").attr("d", function(d) {
        return valueline(d.data);
      }).attr('stroke', (function(d, serieIndex) {
        return d.data[0].config.color;
      })).attr("fill", "none").attr("stroke-width", _conf.line.stroke.width);
    }
    if (_conf.canvas.render === 'dot' || _conf.canvas.render === 'dotline') {
      return series.selectAll(".circle").data(function(d) {
        return d.data;
      }).enter().append("circle").attr('cx', function(d) {
        return scaleW(d.x);
      }).attr('cy', function(d) {
        return scaleH(d.y);
      }).attr('data-x', function(d) {
        return d.x;
      }).attr('data-y', function(d) {
        return d.y;
      }).attr('data-color', function(d) {
        return d.config.color;
      }).attr('r', (function(d) {
        return d.config.r;
      })).attr('stroke', (function(d) {
        if (_conf.point.mode === 'empty') {
          return d.config.color;
        } else if (_conf.point.mode === 'fill') {
          return _conf.canvas.bgcolor;
        } else {
          throw new Error("Unknown point mode '" + _conf.point.mode + "'");
        }
      })).attr('fill', (function(d) {
        if (_conf.point.mode === 'empty') {
          return _conf.canvas.bgcolor;
        } else if (_conf.point.mode === 'fill') {
          return d.config.color;
        } else {
          throw new Error("Unknown point mode '" + _conf.point.mode + "'");
        }
      })).attr('stroke-width', (function(d) {
        var _ref, _ref1, _ref2;
        return (_ref = (_ref1 = d.config) != null ? (_ref2 = _ref1.stroke) != null ? _ref2.width : void 0 : void 0) != null ? _ref : _conf.point.stroke.width;
      })).on('mouseover', function(d) {
        var data;
        _effectOver({
          canvas: _canvas,
          circleNode: this,
          data: d
        });
        data = _tooltipCallback({
          format: _conf.tooltip.format,
          canvas: _canvas,
          tooltipNode: _tooltipNode,
          circleNode: this,
          data: d
        });
        _tooltipNode.html(_tooltipTemplate(data));
        _tooltipShow(this, {
          canvas: {
            width: _conf.canvas.width,
            height: _conf.canvas.height
          },
          tooltip: {
            alwaysInside: _conf.tooltip.alwaysInside
          }
        }, _tooltipNode, d);
        if (_conf.point.fadeOnMouseover) {
          $(_canvas.node()).find(".series").not("[data-hide='true']").not("[id=" + d.serie + "]").fadeTo(5, 0.15);
          return $(this).show();
        }
      }).on('mouseout', function(d) {
        _effectOut({
          canvas: _canvas,
          circleNode: this,
          data: d
        });
        _tooltipHide(_tooltipNode);
        if (_conf.point.fadeOnMouseover) {
          return $(_canvas.node()).find(".series").not("[id=" + d.serie + "]").not("[data-hide='true']").fadeTo(1, 1);
        }
      });
    } else {
      throw new Error("Unknown render value '" + _canvas.render + "'");
    }
  };

  Main.prototype.render = function() {
    if (this._SVG == null) {
      this._SVG = this.createSVG();
    }
    this._CLASS.logo.render({
      confCanvas: this._CONF.canvas,
      confLogo: this._CONF.logo,
      style: this._CONF.style.logo
    });
    this._CLASS.gridX.render({
      scale: this._SCALE.x,
      confCanvas: this._CONF.canvas,
      confGrid: this._CONF.grid.x,
      style: this._CONF.style.grid.x
    });
    this._CLASS.gridY.render({
      scale: this._SCALE.y,
      confCanvas: this._CONF.canvas,
      confGrid: this._CONF.grid.y,
      style: this._CONF.style.grid.y
    });
    this._CLASS.axisX.render({
      confAxis: this._CONF.axis.x,
      confCanvas: this._CONF.canvas,
      style: this._CONF.style.axis.x
    });
    this._CLASS.axisY.render({
      confAxis: this._CONF.axis.y,
      confCanvas: this._CONF.canvas,
      style: this._CONF.style.axis.y
    });
    this._CLASS.labelX.render({
      confCanvas: this._CONF.canvas,
      confLabel: this._CONF.canvas.label.x,
      style: this._CONF.style.label.x
    });
    this._CLASS.labelY.render({
      confCanvas: this._CONF.canvas,
      confLabel: this._CONF.canvas.label.y,
      style: this._CONF.style.label.y
    });
    this.renderPoints();
    this._CLASS.title.render({
      confCanvas: this._CONF.canvas,
      confTitle: this._CONF.canvas.title,
      style: this._CONF.style.title
    });
    if (this._CONF.legends.show) {
      this._CLASS.legend.render({
        svg: this._SVG,
        confCanvas: this._CONF.canvas,
        series: this._SERIES,
        confLegends: this._CONF.legends
      });
    }
    this._CLASS.cross.render({
      svg: this._SVG,
      confCanvas: this._CONF.canvas,
      confCross: this._CONF.canvas.cross,
      style: this._CONF.style.cross
    });
    this._CLASS.cross.renderValue({
      svg: this._SVG,
      scale: this._SCALE,
      confCanvas: this._CONF.canvas,
      confCrossV: this._CONF.canvas.crossValue,
      style: this._CONF.style.crossValue.x
    });
    return this._CLASS.plugin.render({
      context: this,
      confCanvas: this._CONF.canvas,
      iconsFolder: this._CONF.pluginsIconsFolder,
      confPlugins: this._CONF.plugins,
      style: this._CONF.style.plugins
    });
  };

  return Main;

})();
});

;require.register("ylchart/components/axis", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require('ylchart/utils/style')
};

exp.Main = Main = (function() {
  function Main(svg) {
    this._AXIS = svg.append("line");
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._AXIS
    };
  };

  Main.prototype.render = function(params) {
    var confAxis, confCanvas;
    confAxis = params.confAxis;
    confCanvas = params.confCanvas;
    new M.style.Main(this._AXIS).apply(params.style);
    switch (confAxis.orient) {
      case 'bottom':
        return this._AXIS.attr("x1", confCanvas.padding[0]).attr("y1", confCanvas.height - confCanvas.padding[1]).attr("x2", confCanvas.width - confCanvas.padding[0]).attr("y2", confCanvas.height - confCanvas.padding[1]);
      case "top":
        return this._AXIS.attr("x1", confCanvas.padding[0]).attr("y1", confCanvas.padding[1]).attr("x2", confCanvas.width - confCanvas.padding[0]).attr("y2", confCanvas.padding[1]);
      case "left":
        return this._AXIS.attr("x1", confCanvas.padding[0]).attr("y1", confCanvas.padding[1]).attr("x2", confCanvas.padding[0]).attr("y2", confCanvas.height - confCanvas.padding[1]);
      case "right":
        return this._AXIS.attr("x1", confCanvas.width - confCanvas.padding[0]).attr("y1", confCanvas.padding[1]).attr("x2", confCanvas.width - confCanvas.padding[0]).attr("y2", confCanvas.height - confCanvas.padding[1]);
      default:
        throw new Error("Unknown orientation: ", confAxis.orient);
    }
  };

  return Main;

})();
});

;require.register("ylchart/components/cross", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require('ylchart/utils/style')
};

exp.Main = Main = (function() {
  function Main(svg) {
    this._CROSSPANEL = svg.append("g");
    this._CROSSX = this._CROSSPANEL.append("line");
    this._CROSSY = this._CROSSPANEL.append("line");
    this._VALUE = this._CROSSPANEL.append("g").style("opacity", 0);
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._CROSSPANEL,
      crossX: this._CROSSX,
      crossY: this._CROSSY,
      value: this._VALUE
    };
  };

  Main.prototype.render = function(params) {
    var confCanvas, height, offsetX, offsetY, padX, padY, style, timeoutUnmoved, width, _crossX, _crossY;
    confCanvas = params.confCanvas;
    style = params.style;
    padX = confCanvas.padding[0];
    padY = confCanvas.padding[1];
    width = confCanvas.width;
    height = confCanvas.height;
    offsetX = params.confCross.x.offset;
    offsetY = params.confCross.y.offset;
    _crossX = this._CROSSX;
    _crossY = this._CROSSY;
    new M.style.Main(this._CROSSX).apply(style.x).attr("x1", -width).attr("y1", padY).attr("x2", -width).attr("y2", height - padY);
    new M.style.Main(this._CROSSY).apply(style.y).attr("x1", padX).attr("y1", -height).attr("x2", width - padX).attr("y2", -height);
    timeoutUnmoved = null;
    return params.svg.on("mousemove.cross", function(d) {
      var eventX, eventY;
      eventX = d3.mouse(this)[0];
      eventY = d3.mouse(this)[1];
      if (eventY >= padY + offsetY && eventY <= height - padY - offsetY && eventX >= padX + offsetX && eventX <= width - padX - offsetX) {
        if (params.confCross.x.show && eventX >= padX + offsetX && eventX <= width - padX - offsetX) {
          _crossX.attr("x1", eventX - offsetX).attr("x2", eventX - offsetX);
        }
        if (params.confCross.y.show && eventY >= padY + offsetY && eventY <= height - padY - offsetY) {
          _crossY.attr("y1", eventY - offsetY).attr("y2", eventY - offsetY);
        }
        _crossX.transition().style('opacity', 1);
        _crossY.transition().style('opacity', 1);
        clearTimeout(timeoutUnmoved);
        return timeoutUnmoved = setTimeout((function() {
          _crossY.transition().duration(500).style('opacity', 0);
          return _crossX.transition().duration(500).style('opacity', 0);
        }), params.confCross.x.duration);
      }
    });
  };

  Main.prototype.renderValue = function(params) {
    var VALUE, box, style, text, textDim, timeoutUnmoved;
    style = params.style;
    box = this._VALUE.append("rect");
    new M.style.Main(box).apply(style.background);
    text = this._VALUE.append("text");
    new M.style.Main(text).apply(style.text).text("YLChartPile");
    textDim = text.node().getBBox();
    if (params.confCrossV.x.show) {
      timeoutUnmoved = null;
      VALUE = this._VALUE;
      return params.svg.on("mousemove.crossValue", function() {
        var eventX, eventY, positionX, valueX;
        eventX = d3.mouse(this)[0];
        eventY = d3.mouse(this)[1];
        if (d3.mouse(this)[1] >= params.confCanvas.padding[1] && d3.mouse(this)[1] <= params.confCanvas.height - params.confCanvas.padding[1] && d3.mouse(this)[0] >= params.confCanvas.padding[0] && d3.mouse(this)[0] <= params.confCanvas.width - params.confCanvas.padding[0]) {
          if (eventX < params.confCanvas.padding[0]) {
            eventX = params.confCanvas.padding[0];
          } else if (eventX > params.confCanvas.width - params.confCanvas.padding[0]) {
            eventX = params.confCanvas.width - params.confCanvas.padding[0];
          }
          positionX = eventX;
          if (eventX < params.confCanvas.padding[0] + textDim.width / 2) {
            positionX = params.confCanvas.padding[0] + textDim.width / 2;
          } else if (eventX > params.confCanvas.width - params.confCanvas.padding[0] - textDim.width / 2) {
            positionX = params.confCanvas.width - params.confCanvas.padding[0] - textDim.width / 2;
          }
          text.attr("y", textDim.height - textDim.height * 0.25).attr("x", textDim.width / 2);
          box.attr("width", textDim.width).attr("height", textDim.height);
          valueX = params.scale.x.invert(eventX);
          switch (params.confCrossV.x.orient) {
            case 'top':
              eventY = params.confCanvas.padding[1];
              break;
            case 'bottom':
              eventY = params.confCanvas.height - params.confCanvas.padding[1];
          }
          text.text(params.confCrossV.x.format(valueX));
          VALUE.attr("transform", "translate(" + (positionX - textDim.width / 2) + ", " + eventY + ")");
          VALUE.attr("cy", d3.mouse(this)[1]);
          VALUE.transition().duration(300).style('opacity', 1);
          clearTimeout(timeoutUnmoved);
          return timeoutUnmoved = setTimeout((function() {
            return VALUE.transition().duration(500).style('opacity', 0);
          }), params.confCrossV.x.duration);
        }
      });
    }
  };

  return Main;

})();
});

;require.register("ylchart/components/grid", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require('ylchart/utils/style')
};

exp.Main = Main = (function() {
  function Main(svg) {
    this._GRID = svg.append("g");
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._GRID
    };
  };

  Main.prototype.render = function(params) {
    var confCanvas, confGrid, grid, gridTicks, style, text, tickSize, trans;
    confCanvas = params.confCanvas;
    confGrid = params.confGrid;
    style = params.style;
    tickSize = confGrid.tick.size;
    if (tickSize === 'auto') {
      if (confGrid.orient === 'bottom' || confGrid.orient === 'top') {
        tickSize = confCanvas.height - confCanvas.padding[1] * 2;
      } else {
        tickSize = -confCanvas.width + confCanvas.padding[0] * 2;
      }
    }
    switch (confGrid.orient) {
      case 'bottom':
        trans = "translate(0, " + confCanvas.padding[1] + ")";
        break;
      case 'top':
        trans = "translate(0, " + (confCanvas.height - confCanvas.padding[1]) + ")";
        break;
      case 'right':
        trans = "translate(" + (confCanvas.width - confCanvas.padding[0]) + ", 0)";
        break;
      case 'left':
        trans = "translate(" + confCanvas.padding[0] + ", 0)";
        break;
      default:
        trans = '';
        throw new Error("Unknown orientation: ", confGrid.orient);
    }
    grid = d3.svg.axis().scale(params.scale).orient(confGrid.orient).tickSize(tickSize);
    if (confGrid.tick.freq !== "auto") {
      grid.ticks(confGrid.tick.freq);
    }
    if (confGrid.format != null) {
      grid.tickFormat(d3.time.format(confGrid.format));
      grid.ticks(d3.time.months.utc, confGrid.tick.freq === "auto" ? 1 : confGrid.tick.freq);
    }
    this._GRID.attr("transform", trans).attr("class", "axis " + style["class"]).call(grid);
    gridTicks = this._GRID.selectAll("line");
    new M.style.Main(gridTicks).apply(style.tick);
    text = this._GRID.selectAll("text");
    new M.style.Main(text).apply(style.text);
    return this._GRID.selectAll("path").style("display", "none");
  };

  return Main;

})();
});

;require.register("ylchart/components/label", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require('ylchart/utils/style')
};

exp.Main = Main = (function() {
  function Main(svg) {
    this._LABEL = svg.append("text");
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._LABEL
    };
  };

  Main.prototype.render = function(params) {
    var confCanvas, confLabel, offset, style, textDim, trans;
    confCanvas = params.confCanvas;
    confLabel = params.confLabel;
    style = params.style;
    offset = confLabel.offset || 0;
    new M.style.Main(this._LABEL).apply(style).text(confLabel.text);
    textDim = this._LABEL.node().getBBox();
    switch (confLabel.orient) {
      case 'bottom':
        trans = "translate(" + (confCanvas.width / 2) + ",          " + (confCanvas.height - confCanvas.padding[1] + textDim.height + offset) + ")";
        break;
      case 'top':
        trans = "translate(" + (confCanvas.width / 2) + ", " + (confCanvas.padding[1] - offset) + ")";
        break;
      case 'left':
        trans = "rotate(-90) translate(" + (-confCanvas.height / 2) + ", " + (confCanvas.padding[0] + 10) + ")";
        break;
      case 'right':
        trans = "translate(" + (confCanvas.width - confCanvas.padding[0]) + ", " + (confCanvas.padding[1] / 2) + ")";
        break;
      default:
        trans = '';
        throw new Error("Unknown orientation: ", confLabel.orient);
    }
    return this._LABEL.attr("transform", trans);
  };

  return Main;

})();
});

;require.register("ylchart/components/legend", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(svg) {
    this._LEGENDS = svg.append("g");
    this._HIDEALL = false;
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._LEGENDS
    };
  };

  Main.prototype.render = function(params) {
    var SELECTOR, SERIES, callback, color, confCanvas, confLegends, currentX, currentY, fontSize, i, legend, nbrLegends, posX, posY, rectHeight, rectMargin, rectWidth, serie, text, textWidth, widthSpace, _i, _results;
    confCanvas = params.confCanvas;
    confLegends = params.confLegends;
    SERIES = params.series;
    SELECTOR = confCanvas.selector;
    rectWidth = confLegends.rect.width;
    rectHeight = confLegends.rect.height;
    textWidth = confLegends.text.width;
    rectMargin = confLegends.margin;
    fontSize = confLegends.text.size;
    widthSpace = confCanvas.width - confCanvas.padding[0] * 2;
    posX = confCanvas.padding[0] - confLegends.padding[0];
    posY = confCanvas.height - confLegends.padding[1];
    this._LEGENDS.attr("transform", "translate(" + posX + ", " + posY + ")");
    currentX = 0;
    currentY = confLegends.padding[1];
    nbrLegends = SERIES.length - 1;
    if (confLegends.toggleAll.show) {
      nbrLegends++;
    }
    _results = [];
    for (i = _i = 0; _i <= nbrLegends; i = _i += 1) {
      params.svg.attr("height", confCanvas.height + currentY);
      if (i === nbrLegends && confLegends.toggleAll.show) {
        legend = this.drawLegend(this._LEGENDS, i, currentX, currentY, rectWidth, rectHeight, rectMargin, confLegends.toggleAll.color, "legend option", fontSize, 2, confLegends.toggleAll.text[0]);
        callback = this.toggleSeries;
      } else {
        serie = SERIES[i];
        color = serie.data[0].config.color;
        text = serie.name;
        if (confLegends.format != null) {
          text = confLegends.format(text);
        }
        legend = this.drawLegend(this._LEGENDS, i, currentX, currentY, rectWidth, rectHeight, rectMargin, color, "legend", fontSize, 5, text);
        callback = this.toggleSerie;
      }
      if (currentX + rectWidth + textWidth + rectMargin > widthSpace - rectWidth - textWidth - rectMargin) {
        currentX = 0;
        currentY += 15;
      } else {
        currentX += rectWidth + textWidth + rectMargin;
      }
      _results.push(legend.on("click", (function(scope, cb, index) {
        return function() {
          return cb.call(this, scope, SELECTOR, index, [legend, confLegends.toggleAll.text]);
        };
      })(this, callback, i)));
    }
    return _results;
  };

  Main.prototype.drawLegend = function(LEGENDS, i, currentX, currentY, rectWidth, rectHeight, rectMargin, color, className, fontSize, radius, text) {
    var legend, rect;
    legend = LEGENDS.append("g").style("cursor", "pointer").attr("transform", "translate(" + currentX + ", " + currentY + ")").attr("data-index", i).attr("data-hide", "false").attr("class", className);
    rect = legend.append("rect").attr("width", rectWidth).attr("height", rectHeight).attr("fill", color).attr("rx", radius).attr("ry", radius);
    legend.append("text").attr("x", rectMargin + rectWidth).attr("y", rectHeight - 1).attr("fill", color).attr("font-size", fontSize).attr("background", "#ff0000").text(text);
    return legend;
  };

  Main.prototype.toggleSerie = function(scope, selector, index) {
    var hide, opacity;
    opacity = $(this).find("rect").css("opacity");
    hide = this.getAttribute("data-hide");
    if (hide === "false") {
      $(this).find("rect").fadeTo(100, 0.1);
      $(selector).find(".series#" + index).attr("data-hide", "true");
      this.setAttribute("data-hide", "true");
    } else {
      $(this).find("rect").fadeTo(100, 1);
      $(selector).find(".series#" + index).attr("data-hide", "false");
      this.setAttribute("data-hide", "false");
    }
    return $(selector).find(".series#" + index).toggle("normal");
  };

  Main.prototype.toggleSeries = function(scope, selector, index, options) {
    var hide;
    hide = !scope._HIDEALL;
    scope._HIDEALL = hide;
    if (hide) {
      options[0].select("text").text(options[1][1]);
      $(this).parent().find("rect").fadeTo(500, 0.1);
      $(selector).find(".series").hide("normal");
    } else {
      options[0].select("text").text(options[1][0]);
      $(this).parent().find("rect").fadeTo(100, 1);
      $(selector).find(".series").show("normal");
    }
    $(this).parent().find(".legend").attr("data-hide", hide);
    return $(selector).find(".series").attr("data-hide", hide);
  };

  return Main;

})();
});

;require.register("ylchart/components/logo", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require("ylchart/utils/style")
};

exp.Main = Main = (function() {
  function Main(svg, canvas) {
    this._IMAGE = svg.append("image");
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._IMAGE
    };
  };

  Main.prototype.render = function(params) {
    var HEIGHT, PADDING, WIDTH, confCanvas, confLogo, posX, posY, style;
    confCanvas = params.confCanvas;
    HEIGHT = confCanvas.height;
    WIDTH = confCanvas.width;
    PADDING = confCanvas.padding;
    confLogo = params.confLogo;
    style = params.style;
    posX = posY = 100;
    if (confLogo.position.y === 'bottom') {
      posY = HEIGHT - PADDING[1] - style.height;
    } else if (confLogo.position.y === 'top') {
      posY = PADDING[1];
    }
    if (confLogo.position.x === 'right') {
      posX = WIDTH - PADDING[0] - style.width;
    } else if (confLogo.position.x === 'left') {
      posX = PADDING[0];
    }
    return new M.style.Main(this._IMAGE).apply(params.style).attr("x", posX).attr("y", posY);
  };

  return Main;

})();
});

;require.register("ylchart/components/plugin", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(selector) {
    this._MENU = $("<div/>", {
      id: "pluginsMenu"
    }).appendTo(selector);
    this._PLUGINSDOM = {};
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._MENU,
      plugins: this._PLUGINSDOM
    };
  };

  Main.prototype.render = function(PARAMS) {
    var callback, confCanvas, context, icon, plugin, pluginModule, pluginsMenu, style, _results;
    confCanvas = PARAMS.confCanvas;
    style = PARAMS.style;
    pluginsMenu = this._MENU;
    switch (style.panel.position) {
      case "right":
        style.panel.position = "absolute";
        style.panel.left = confCanvas.width + 1;
        break;
      case "left":
        style.panel.position = "absolute";
        style.panel.left = 0;
    }
    pluginsMenu.css(style.panel);
    pluginsMenu.on("mouseover.menuPlugin", function() {
      return pluginsMenu.animate({
        opacity: 1
      }, 10);
    });
    pluginsMenu.on("mouseout.menuPlugin", function() {
      return pluginsMenu.animate({
        opacity: style.panel.opacity
      }, 10);
    });
    _results = [];
    for (plugin in PARAMS.confPlugins) {
      if (PARAMS.confPlugins[plugin].enable) {
        icon = $("<i/>", {
          "class": "fa fa-" + PARAMS.confPlugins[plugin].fa + " fa-2x",
          title: PARAMS.confPlugins[plugin].displayName
        }).appendTo(pluginsMenu);
        icon.css({
          cursor: "pointer"
        });
        pluginModule = require('ylchart/plugins/' + plugin);
        context = PARAMS.context;
        callback = pluginModule.onClick.bind(this, context, confCanvas.selector, PARAMS.confPlugins[plugin]);
        icon.click(function() {
          return callback();
        });
        _results.push(this._PLUGINSDOM[plugin] = icon);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Main;

})();
});

;require.register("ylchart/components/title", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  style: require('ylchart/utils/style')
};

exp.Main = Main = (function() {
  function Main(svg) {
    this.boxTitle = svg.append("g");
    this.texts = [];
  }

  Main.prototype.getDOM = function() {
    return {
      root: this.boxTitle,
      texts: this.texts
    };
  };

  Main.prototype.render = function(params) {
    var boxText, confCanvas, confTitle, dimText, i, nextPos, obj, posX, posY, style, _i, _len, _ref;
    confCanvas = params.confCanvas;
    confTitle = params.confTitle;
    style = params.style;
    posX = confTitle.position.x;
    posY = confTitle.position.y;
    nextPos = [posX, posY];
    this.texts = [];
    _ref = confTitle.texts;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      obj = _ref[i];
      boxText = this.boxTitle.append("text");
      new M.style.Main(boxText).apply(style[i]).attr("y", nextPos[1]).attr("class", confTitle["class"]).attr("font-family", confTitle.fontFamily).text(obj.text);
      dimText = boxText.node().getBBox();
      nextPos[1] = nextPos[1] + dimText.height + (obj.interline || 0);
      this.texts.push({
        node: boxText,
        dim: dimText
      });
    }
    return this.boxTitle.attr("transform", "translate(" + posX + ",      " + (posY + this.texts[0].dim.height / 2) + ")");
  };

  return Main;

})();
});

;require.register("ylchart/components/tooltip", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(selector) {
    if (this._TOOLTIP == null) {
      this._TOOLTIP = d3.select(selector).append("div").attr('class', 'ylchart_tooltip').style('opacity', 0).style('left', 0).style('top', 0).attr('id', 'ylchart_tooltip');
    }
  }

  Main.prototype.getDOM = function() {
    return {
      root: this._TOOLTIP
    };
  };

  Main.prototype.show = function(context, conf, tooltipNode, d) {
    var eventX, eventY, heightTooltip, left, top, widthTooltip;
    tooltipNode.attr("width", 200).attr("height", 100);
    eventX = d3.mouse(context)[0];
    eventY = d3.mouse(context)[1];
    left = eventX + d.config.stroke.width;
    top = eventY + d.config.stroke.width;
    if (conf.tooltip.alwaysInside) {
      if (eventX > conf.canvas.width / 2.0) {
        widthTooltip = parseFloat(tooltipNode.style('width').replace("px", ''));
        left = eventX - d.config.stroke.width - widthTooltip;
      }
      if (eventY > conf.canvas.height / 2.0) {
        heightTooltip = parseFloat(tooltipNode.style('height').replace("px", ''));
        top = eventY - d.config.stroke.width - heightTooltip;
      }
    }
    return tooltipNode.style("left", left + 'px').style("top", top + 'px').transition().duration(200).style("opacity", 0.9);
  };

  Main.prototype.hide = function(tooltipNode) {
    return tooltipNode.transition().duration(500).style("opacity", 0);
  };

  Main.prototype.getTemplate = function(str) {
    return this._templates[str];
  };

  Main.prototype.getCallback = function(str) {
    return this._callbacks[str];
  };

  Main.prototype._templates = {
    singlePoint: function(data) {
      var html;
      return html = "        <h1>" + data.serieName + "</h1>        <div class='serie' id='0'>" + data.x + " : " + data.y + "        <div class='swatch' style='background-color: " + data.color + "'></div>      </div>";
    },
    multipleVertical: function(data) {
      var d, html, i, _i, _len;
      html = "<h1>" + data[0].x + "</h1>";
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        d = data[i];
        if (!d.hide) {
          html += ("<div class='serie' id='" + i + "'>" + d.serieName + " : " + d.y) + "<div class='swatch'" + ("style='background-color: " + d.color + "'></div>") + "</div>";
        }
      }
      return html;
    }
  };

  Main.prototype._callbacks = {
    singlePoint: function(params) {
      var x, _circleNode;
      _circleNode = params.circleNode;
      x = _circleNode.getAttribute('data-x');
      return {
        color: params.data.config.color,
        serieName: params.circleNode.parentNode.getAttribute("title"),
        x: x,
        y: params.data.y,
        hide: _circleNode.parentNode.getAttribute("data-hide") === "true"
      };
    },
    multipleVertical: function(params) {
      var cx, res, title, x, _circleNode;
      _circleNode = params.circleNode;
      cx = _circleNode.getAttribute('cx');
      x = _circleNode.getAttribute('data-x');
      title = _circleNode.parentNode.getAttribute('title');
      res = [];
      $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
        return res.push({
          title: title,
          serieName: node.parentNode.getAttribute("title"),
          color: node.getAttribute("data-color"),
          y: node.getAttribute("data-y"),
          x: x,
          hide: node.parentNode.getAttribute("data-hide") === "true"
        });
      });
      return res;
    }
  };

  return Main;

})();
});

;require.register("ylchart/config", function(exports, require, module) {
var M, Main, exp;

module.exports = exp = {};

M = {
  tools: require('ylchart/utils/tools')
};

exp.Main = Main = (function() {
  function Main(userConfig) {
    M.tools.updateObject(this.defaultConfig, userConfig);
  }

  Main.prototype.get = function() {
    return this.defaultConfig;
  };

  Main.prototype.defaultConfig = {
    style: {
      plugins: {
        panel: {
          position: "right",
          left: null,
          top: 0,
          opacity: 0.3
        }
      },
      axis: {
        x: {
          stroke: "#2b2e33",
          "class": "x",
          "stroke-width": 1
        },
        y: {
          stroke: "#2b2e33",
          "class": "y",
          "stroke-width": 1
        }
      },
      grid: {
        x: {
          "class": "x",
          tick: {
            stroke: "#f5f5f5",
            "width-stroke": 2
          },
          text: {
            fill: "#2b2e33",
            "font-size": 13,
            "font-weight": "normal"
          }
        },
        y: {
          "class": "y",
          tick: {
            stroke: "#f5f5f5"
          },
          text: {
            fill: "#2b2e33",
            "font-size": 13,
            "font-weight": "normal"
          }
        }
      },
      label: {
        x: {
          "text-anchor": "middle",
          "class": "label x",
          fill: "#5f5f5f",
          "font-size": 14,
          "font-weight": "bold"
        },
        y: {
          "text-anchor": "middle",
          "font-size": 14,
          fill: "#5f5f5f",
          "class": "label y",
          "font-weight": "bold"
        }
      },
      title: [
        {
          fill: "#2f2f2f",
          "font-size": 15,
          "font-weight": "bold"
        }, {
          fill: "#2f2f2f",
          "font-size": 15,
          "font-weight": "bold"
        }, {
          fill: "#2f2f2f",
          "font-size": 12
        }
      ],
      cross: {
        x: {
          "class": "crossX",
          stroke: "#44A0FF",
          "stroke-width": 1
        },
        y: {
          "class": "crossY",
          stroke: "#FFA044",
          "stroke-width": 1
        }
      },
      crossValue: {
        x: {
          text: {
            "font-size": 12,
            "text-anchor": "middle",
            fill: "#FFFFFF"
          },
          background: {
            fill: "#0971b7",
            rx: 5,
            ry: 5
          }
        }
      }
    },
    tooltip: {
      template: "singlePoint",
      callback: "singlePoint",
      alwaysInside: true
    },
    canvas: {
      scale: {
        x: {
          nice: false,
          padding: [10, 10]
        },
        y: {
          nice: true,
          padding: [10, 10]
        }
      },
      bgcolor: "#FFFFFF",
      render: "dot",
      title: {
        fontFamily: "arial",
        position: {
          x: 20,
          y: 3
        },
        "class": "title",
        texts: [
          {
            text: "YLChart Example",
            interline: -4.9
          }, {
            text: "The interactive chart library",
            interline: -4.9
          }, {
            text: "Play with datas !"
          }
        ]
      },
      label: {
        x: {
          text: "X Axis",
          offset: 10,
          orient: "bottom"
        },
        y: {
          text: "Y Axis",
          orient: "right",
          offset: 0
        }
      },
      selector: null,
      width: 600.0,
      height: 400.0,
      padding: [0, 0],
      cross: {
        x: {
          show: true,
          offset: 0,
          duration: 1200
        },
        y: {
          show: true,
          offset: 0,
          duration: 1200
        }
      },
      crossValue: {
        x: {
          orient: 'bottom',
          show: true,
          format: function(d) {
            var da, m, y;
            da = d.toString().split(" ")[2];
            m = d.toString().split(" ")[1];
            y = d.toString().split(" ")[3].substring(2);
            return "" + da + " " + m + " " + y;
          },
          duration: 1200
        }
      }
    },
    domain: {
      x: {
        margin: 5
      },
      y: {
        margin: 5
      }
    },
    logo: {
      position: {
        x: 'right',
        y: 'bottom'
      }
    },
    line: {
      stroke: {
        width: 2
      }
    },
    point: {
      onMouseover: "singlePoint",
      onMouseout: null,
      fadeOnMouseover: true,
      r: 4,
      mode: 'empty',
      color: "munin",
      stroke: {
        width: 1
      }
    },
    axis: {
      x: {
        orient: "bottom"
      },
      y: {
        orient: "left"
      }
    },
    grid: {
      x: {
        format: "%b",
        orient: "bottom",
        tick: {
          mode: "auto",
          size: "auto",
          freq: "auto"
        }
      },
      y: {
        format: null,
        orient: "right",
        tick: {
          mode: "auto",
          size: "auto",
          freq: "auto"
        }
      }
    },
    legends: {
      show: true,
      format: null,
      toggleAll: {
        show: true,
        color: "#5f5f5f",
        text: ["Hide all", "Show all"]
      },
      text: {
        size: 14,
        width: 60
      },
      rect: {
        width: 10,
        height: 10
      },
      margin: 5,
      padding: [0, 15]
    },
    pluginsIconsFolder: "icons",
    plugins: {
      exportation: {
        fa: "download",
        displayName: "Download chart",
        enable: true,
        copyright: {
          text: "(c) Yves Lange 2015",
          color: "#9f9f9f",
          fontSize: 12
        }
      }
    }
  };

  return Main;

})();
});

;require.register("ylchart/effects/point", function(exports, require, module) {
var exp;

module.exports = exp = {};

exp.singlePoint = {
  onMouseover: function(params) {
    var curStrokeWidth, _circleNode;
    _circleNode = params.circleNode;
    curStrokeWidth = parseFloat(_circleNode.getAttribute("stroke-width"));
    return _circleNode.setAttribute("stroke-width", curStrokeWidth * 2);
  },
  onMouseout: function(params) {
    var curStrokeWidth, _circleNode;
    _circleNode = params.circleNode;
    curStrokeWidth = parseFloat(_circleNode.getAttribute("stroke-width"));
    return _circleNode.setAttribute("stroke-width", curStrokeWidth / 2);
  }
};

exp.multipleVertical = {
  onMouseover: function(params) {
    var cx, strokeWidth, _circleNode;
    _circleNode = params.circleNode;
    cx = _circleNode.getAttribute('cx');
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width')) * 2;
    return $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
      return $(node).attr("stroke-width", strokeWidth);
    });
  },
  onMouseout: function(params) {
    var cx, strokeWidth, _circleNode;
    _circleNode = params.circleNode;
    cx = _circleNode.getAttribute('cx');
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width')) / 2;
    return $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
      return $(node).attr("stroke-width", strokeWidth);
    });
  }
};

exp.multipleVerticalInverted = {
  onMouseover: function(params) {
    var cx, strokeWidth, _circleNode;
    _circleNode = params.circleNode;
    cx = _circleNode.getAttribute('cx');
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width')) * 2;
    return $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
      var fill, stroke;
      $(node).attr("stroke-width", strokeWidth);
      fill = $(node).attr("fill");
      stroke = $(node).attr("stroke");
      $(node).attr("stroke", fill);
      return $(node).attr("fill", stroke);
    });
  },
  onMouseout: function(params) {
    var cx, strokeWidth, _circleNode;
    _circleNode = params.circleNode;
    cx = _circleNode.getAttribute('cx');
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width')) / 2;
    return $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
      var fill, stroke;
      $(node).attr("stroke-width", strokeWidth);
      fill = $(node).attr("fill");
      stroke = $(node).attr("stroke");
      $(node).attr("stroke", fill);
      return $(node).attr("fill", stroke);
    });
  }
};
});

;require.register("ylchart/initialize", function(exports, require, module) {
var M, exp, genData, genDataFunc;

module.exports = exp = {};

M = {
  ylchart: require('ylchart/app'),
  time: require('ylchart/utils/time')
};

genData = function(len, inter) {
  var els, i, _i, _ref;
  if (inter == null) {
    inter = 1;
  }
  els = [];
  for (i = _i = 0, _ref = len - 1; inter > 0 ? _i <= _ref : _i >= _ref; i = _i += inter) {
    els.push({
      x: i * 1000,
      y: Math.random() * 100
    });
  }
  return els;
};

genDataFunc = function(len, inter, func) {
  var els, i, _i, _ref;
  if (inter == null) {
    inter = 1;
  }
  els = [];
  for (i = _i = 0, _ref = len - 1; inter > 0 ? _i <= _ref : _i >= _ref; i = _i += inter) {
    els.push({
      x: i * 1000,
      y: func(i) * 10 + 50
    });
  }
  return els;
};

exp.run = function() {
  var series, t, tooltipMode, ylchart, ylchart2;
  t = new M.time.Main({
    lang: 'en'
  });
  series = [];
  series.push({
    name: "Serie 3",
    data: genDataFunc(24 * 3600 * 120, 48 * 3600, Math.sin),
    config: {
      stroke: {
        width: 1
      }
    }
  });
  series.push({
    name: "Serie 3b",
    data: genDataFunc(24 * 3600 * 120, 48 * 3600, Math.sin),
    config: {
      color: "#00fa0f",
      stroke: {
        width: 1
      }
    }
  });
  tooltipMode = "multipleVertical";
  ylchart = new M.ylchart.Main({
    config: {
      style: {
        label: {
          x: {
            "font-size": 25
          }
        },
        logo: {
          "xlink:href": "your-logo.svg",
          height: 30,
          width: 30
        }
      },
      canvas: {
        render: 'dotline',
        width: 900.0,
        height: 400.0,
        selector: '#chart1',
        padding: [50, 50],
        scale: {
          x: {
            nice: true
          }
        },
        label: {
          x: {
            text: "Months"
          },
          y: {
            text: "Values"
          }
        }
      },
      logo: {
        position: {
          x: 'right',
          y: 'bottom'
        },
        opacity: 0.1
      },
      tooltip: {
        template: tooltipMode,
        callback: tooltipMode
      },
      line: {
        stroke: {
          width: 1
        }
      },
      point: {
        r: 4,
        mode: 'fill',
        onMouseover: "multipleVerticalInverted",
        color: 'light',
        stroke: {
          width: 1,
          color: null
        }
      },
      axis: {
        y: {
          orient: "right"
        }
      },
      pluginsIconsFolder: "icons"
    },
    series: series
  });
  ylchart.render();
  series.push({
    name: "Serie 2",
    data: genDataFunc(24 * 3600 * 120, 36 * 3600 * 2, Math.tan),
    config: {
      color: "#ff0001",
      stroke: {
        width: 1
      }
    }
  });
  ylchart2 = new M.ylchart.Main({
    config: {
      style: {
        label: {
          x: {
            "font-size": 25
          }
        },
        logo: {
          "xlink:href": "your-logo.svg",
          height: 30,
          width: 30
        }
      },
      canvas: {
        render: 'dotline',
        width: 900.0,
        height: 400.0,
        selector: '#chart2',
        padding: [50, 50],
        scale: {
          x: {
            nice: true
          }
        },
        label: {
          x: {
            text: "Months2"
          },
          y: {
            text: "Values2"
          }
        }
      },
      logo: {
        position: {
          x: 'right',
          y: 'bottom'
        },
        opacity: 0.1
      },
      tooltip: {
        template: tooltipMode,
        callback: tooltipMode
      },
      line: {
        stroke: {
          width: 1
        }
      },
      point: {
        r: 4,
        mode: 'fill',
        onMouseover: "multipleVerticalInverted",
        color: 'light',
        stroke: {
          width: 1,
          color: null
        }
      },
      axis: {
        y: {
          orient: "right"
        }
      },
      pluginsIconsFolder: "icons"
    },
    series: series
  });
  return ylchart2.render();
};
});

;require.register("ylchart/plugins/exportation", function(exports, require, module) {
var M, exp;

module.exports = exp = {};

M = {
  logo: require('ylchart/components/logo')
};

exp.onClick = function(context, selector, conf) {
  var a, canvas, height, image, img, msie, pX, pY, svg, svg_xml, text, textDim, ua, width, win;
  image = context._CLASS.logo.getDOM().root.remove();
  text = context._SVG.append("text").attr("fill", conf.copyright.color).attr("font-size", conf.copyright.fontSize + "px").text(conf.copyright.text);
  $(context._CLASS.legend.getDOM().root.node()).find(".legend.option").hide();
  $(context._CLASS.legend.getDOM().root.node()).find(".legend[data-hide='true']").hide();
  width = context._CONF.canvas.width;
  height = context._CONF.canvas.height;
  textDim = text.node().getBBox();
  pX = width - context._CONF.canvas.padding[0] - 10;
  pY = height - context._CONF.canvas.padding[1] - 3;
  text.attr("text-anchor", "end");
  text.attr("transform", "translate(" + pX + ", " + pY + ")");
  svg = $(selector).find("svg")[0];
  svg_xml = (new XMLSerializer()).serializeToString(svg);
  canvas = document.createElement('canvas');
  $("body").after(canvas);
  canvg(canvas, svg_xml);
  $(canvas).remove();
  img = canvas.toDataURL("image/png");
  ua = window.navigator.userAgent;
  msie = ua.indexOf("MSIE ");
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    console.log("Internet explorer detected");
    window.winIE = win = window.open();
    win.document.body.innerHTML = "<center><img src='" + img + "'>" + "</img><br>Please right click on the image and choose 'Save image as...'</center>";
    win.document.close();
  } else {
    a = document.createElement('a');
    a.href = img;
    a.download = "your-logo.png";
    $("body").append(a);
    a.click();
  }
  context._CLASS.logo = new M.logo.Main(context._SVG);
  context._CLASS.logo.render({
    confCanvas: context._CONF.canvas,
    confLogo: context._CONF.logo,
    style: context._CONF.style.logo
  });
  text.remove();
  $(context._CLASS.legend.getDOM().root.node()).find(".legend.option").show();
  return $(context._CLASS.legend.getDOM().root.node()).find(".legend[data-hide='true']").show();
};
});

;require.register("ylchart/utils/design", function(exports, require, module) {
var computePadding, exp;

module.exports = exp = {};

exp.computePadding = computePadding = function(confPoint) {
  var pad;
  pad = confPoint.r + confPoint.stroke.width / 2.0;
  return [pad, pad];
};
});

;require.register("ylchart/utils/domain", function(exports, require, module) {
var exp, fixDomain, getDomain;

module.exports = exp = {};

exp.computeDomain = getDomain = function(series) {
  var maxX, maxY, minX, minY, point, serie, _i, _j, _len, _len1, _ref;
  maxX = maxY = Number.MIN_VALUE;
  minX = minY = Number.MAX_VALUE;
  for (_i = 0, _len = series.length; _i < _len; _i++) {
    serie = series[_i];
    _ref = serie.data;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      point = _ref[_j];
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.y > maxY) {
        maxY = point.y;
      }
      if (point.y < minY) {
        minY = point.y;
      }
    }
  }
  return {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY
  };
};

exp.fixDomain = fixDomain = function(args) {
  var confDomain, domain;
  domain = args.domain;
  confDomain = args.confDomain;
  if (domain.maxX === domain.minX) {
    domain.maxX += confDomain.x.margin;
    domain.minX -= confDomain.x.margin;
  }
  if (domain.maxY === domain.minY) {
    domain.maxY += confDomain.y.margin;
    return domain.minY -= confDomain.y.margin;
  }
};
});

;require.register("ylchart/utils/palette", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(palette) {
    var _palettes;
    _palettes = this.palettes();
    this._PALETTE = _palettes[palette];
    this._INDEX = 0;
  }

  Main.prototype.isDefined = function() {
    if (this._PALETTE != null) {
      return true;
    }
    return false;
  };

  Main.prototype.color = function(i) {
    return this._PALETTE[i % this._PALETTE.length];
  };

  Main.prototype.palettes = function() {
    var schemes;
    schemes = {};
    schemes.spectrum14 = ['#ecb796', '#dc8f70', '#b2a470', '#92875a', '#716c49', '#d2ed82', '#bbe468', '#a1d05d', '#e7cbe6', '#d8aad6', '#a888c2', '#9dc2d3', '#649eb9', '#387aa3'].reverse();
    schemes.spectrum2000 = ['#57306f', '#514c76', '#646583', '#738394', '#6b9c7d', '#84b665', '#a7ca50', '#bfe746', '#e2f528', '#fff726', '#ecdd00', '#d4b11d', '#de8800', '#de4800', '#c91515', '#9a0000', '#7b0429', '#580839', '#31082b'];
    schemes.spectrum2001 = ['#2f243f', '#3c2c55', '#4a3768', '#565270', '#6b6b7c', '#72957f', '#86ad6e', '#a1bc5e', '#b8d954', '#d3e04e', '#ccad2a', '#cc8412', '#c1521d', '#ad3821', '#8a1010', '#681717', '#531e1e', '#3d1818', '#320a1b'];
    schemes.classic9 = ['#423d4f', '#4a6860', '#848f39', '#a2b73c', '#ddcb53', '#c5a32f', '#7d5836', '#963b20', '#7c2626', '#491d37', '#2f254a'].reverse();
    schemes.httpStatus = {
      503: '#ea5029',
      502: '#d23f14',
      500: '#bf3613',
      410: '#efacea',
      409: '#e291dc',
      403: '#f457e8',
      408: '#e121d2',
      401: '#b92dae',
      405: '#f47ceb',
      404: '#a82a9f',
      400: '#b263c6',
      301: '#6fa024',
      302: '#87c32b',
      307: '#a0d84c',
      304: '#28b55c',
      200: '#1a4f74',
      206: '#27839f',
      201: '#52adc9',
      202: '#7c979f',
      203: '#a5b8bd',
      204: '#c1cdd1'
    };
    schemes.colorwheel = ['#b5b6a9', '#858772', '#785f43', '#96557e', '#4682b4', '#65b9ac', '#73c03a', '#cb513a'].reverse();
    schemes.cool = ['#5e9d2f', '#73c03a', '#4682b4', '#7bc3b8', '#a9884e', '#c1b266', '#a47493', '#c09fb5'];
    schemes.munin = ['#00cc00', '#0066b3', '#ff8000', '#ffcc00', '#330099', '#990099', '#ccff00', '#ff0000', '#808080', '#008f00', '#00487d', '#b35a00', '#b38f00', '#6b006b', '#8fb300', '#b30000', '#bebebe', '#80ff80', '#80c9ff', '#ffc080', '#ffe680', '#aa80ff', '#ee00cc', '#ff8080', '#666600', '#ffbfff', '#00ffcc', '#cc6699', '#999900'];
    schemes.paired = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];
    schemes.light = ["#0099ef", "#ff009d", "#56b501", "#ffee52", "#a34100", "#0018ef", "#ff89d2", "#6ee801", "#ef0018", "#ffa468", "#00efd7", "#b3006e", "#aefe66", "#ed7446", "#572200", "#0010a3", "#326901"];
    return schemes;
  };

  return Main;

})();
});

;require.register("ylchart/utils/scale", function(exports, require, module) {
var M, computeScales, exp;

module.exports = exp = {};

M = {
  domain: require('ylchart/utils/domain')
};

exp.computeScales = computeScales = function(args) {
  var scales, _axis, _canvas, _domain, _grid, _pad;
  _axis = args.confAxis;
  _grid = args.confGrid;
  _domain = args.domain;
  _canvas = args.confCanvas;
  _pad = _canvas.padding;
  scales = {
    x: d3.scale.linear(),
    y: d3.scale.linear()
  };
  if (_grid.x.format != null) {
    scales.x = d3.time.scale.utc();
  }
  scales.x.domain([_domain.minX, _domain.maxX]).range([_pad[0], _canvas.width - _pad[0]]);
  if (_canvas.scale.x.nice) {
    scales.x.nice();
  }
  if (_grid.y.format != null) {
    scales.y = d3.time.scale();
  }
  scales.y.domain([_domain.minY, _domain.maxY]).range([_canvas.height - _pad[1], _pad[1]]);
  if (_canvas.scale.y.nice) {
    scales.y.nice();
  }
  return scales;
};
});

;require.register("ylchart/utils/style", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(DOM) {
    this.DOM = DOM;
  }

  Main.prototype.apply = function(styles) {
    var sK, sV;
    for (sK in styles) {
      sV = styles[sK];
      this.DOM.attr(sK, sV);
    }
    return this.DOM;
  };

  return Main;

})();
});

;require.register("ylchart/utils/time", function(exports, require, module) {
var Main, exp;

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(params) {
    var _ref;
    if (params == null) {
      params = {};
    }
    this._CONF = {
      lang: (_ref = params.lang) != null ? _ref : 'enl'
    };
    this._DATE = new Date();
    this._TIMESTAMP = this._DATE.getTime();
    this._MONTHSNAME = {};
    this._MONTHSNAME.en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this._MONTHSNAME.enl = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this._MONTHSNAME.fr = ['Jan', 'F??v', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Ao??t', 'Sep', 'Oct', 'Nov', 'D??c'];
    this._MONTHSNAME.frl = ['Janvier', 'F??vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Ao??t', 'Septembre', 'Octobre', 'Novembre', 'D??cembre'];
  }

  Main.prototype.monthsName = function() {
    return this._MONTHSNAME[this._CONF.lang];
  };

  Main.prototype.getMonth = function() {
    return this.monthsName()[this._DATE.getMonth()];
  };

  Main.prototype.getDay = function() {
    return this._DATE.getDay();
  };

  Main.prototype.getFullDate = function() {
    return this._DATE.getDay() + " " + this.getMonth() + " " + this._DATE.getYear() + " " + this._DATE.getHours() + ":" + this._DATE.getMinutes();
  };

  Main.prototype.getDate = function() {
    return this._DATE;
  };

  Main.prototype.setTimestamp = function(t) {
    if (t == null) {
      return this._TIMESTAMP;
    }
    this._DATE = new Date(parseInt(t) * 1000);
    return this._TIMESTAMP = parseInt(t);
  };

  return Main;

})();
});

;require.register("ylchart/utils/tools", function(exports, require, module) {
var exp, prepareSeries, updateObject;

module.exports = exp = {};

exp.updateObject = updateObject = function(obj1, obj2, replace) {
  var isNode, update;
  if (replace == null) {
    replace = true;
  }
  isNode = function(obj) {
    var _ref;
    if ((obj != null ? (_ref = obj["0"]) != null ? _ref.nodeName : void 0 : void 0) != null) {
      return true;
    } else {
      return false;
    }
  };
  update = function(obj1, obj2, replace) {
    var k, _ref, _ref1, _ref2;
    if (replace == null) {
      replace = true;
    }
    if (obj2 != null) {
      for (k in obj2) {
        if (isNode(obj2[k])) {
          obj1[k] = (_ref = obj2[k][0]) != null ? _ref : obj1[k][0];
        } else if (typeof obj2[k] === 'object' && obj2[k] !== null) {
          if (obj1[k] == null) {
            obj1[k] = {};
          }
          update(obj1[k], obj2[k], replace);
        } else {
          if (replace) {
            obj1[k] = (_ref1 = obj2[k]) != null ? _ref1 : obj1[k];
          } else {
            obj1[k] = (_ref2 = obj1[k]) != null ? _ref2 : obj2[k];
          }
        }
      }
    }
    return obj1;
  };
  return update(obj1, obj2, replace);
};

exp.prepareSeries = prepareSeries = function(args) {
  var i, point, serie, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
  if (((_ref = args.series) != null ? _ref.length : void 0) == null) {
    throw new Error(("No series defined, " + args.series) + "should be an array of objects");
  }
  if (args.series.length < 1) {
    throw new Error("At least one serie must be defined");
  }
  _ref1 = args.series;
  for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
    serie = _ref1[i];
    _ref2 = serie.data;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      point = _ref2[_j];
      point.serie = i;
      point.config = {
        color: args.confPoint.color
      };
      if (args.palette.isDefined()) {
        point.config.color = args.palette.color(i);
      }
      if (((_ref3 = serie.config) != null ? _ref3.color : void 0) != null) {
        point.config.color = serie.config.color;
      }
      point.config.r = ((_ref4 = serie.config) != null ? _ref4.r : void 0) || args.confPoint.r;
      point.config.stroke = {
        width: args.confPoint.stroke.width
      };
      if (((_ref5 = serie.config) != null ? (_ref6 = _ref5.stroke) != null ? _ref6.width : void 0 : void 0) != null) {
        point.config.stroke.width = serie.config.stroke.width;
      }
    }
  }
  return args.series;
};
});

;
//# sourceMappingURL=ylchart.js.map