(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
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

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
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

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("agchart", function(exports, require, module) {
var Main, exp, palette;

palette = require('utils/palette');

module.exports = exp = {};

exp.Main = Main = (function() {
  function Main(args) {
    this._CONF = {
      tooltip: {
        template: "singlePoint",
        format: {
          x: null,
          y: null
        },
        callback: "singlePoint",
        alwaysInside: true
      },
      canvas: {
        bgcolor: "#FFFFFF",
        render: "dot",
        title: {
          text: "AgChart",
          color: "#2f2f2f",
          size: 24,
          position: {
            x: 20,
            y: 20
          }
        },
        label: {
          x: {
            text: null,
            size: 10,
            color: "#7f7f7f"
          },
          y: {
            text: null,
            size: 10,
            color: "#7f7f7f"
          }
        },
        selector: null,
        width: 600.0,
        height: 400.0,
        padding: [0, 0],
        cross: {
          x: {
            showValue: true,
            show: false,
            color: 'black',
            stroke: 1,
            offset: 0
          },
          y: {
            show: false,
            color: 'black',
            stroke: 1,
            offset: 0,
            showValue: true
          }
        },
        crossValue: {
          x: {
            orient: 'bottom',
            show: true,
            color: '#0971b7',
            fontColor: '#ffffff',
            fontSize: 12,
            format: function(d) {
              var da, m, y;
              da = d.toString().split(" ")[2];
              m = d.toString().split(" ")[1];
              y = d.toString().split(" ")[3].substring(2);
              return "" + da + " " + m + " " + y;
            },
            radius: 5
          },
          y: {
            show: true,
            color: 'white'
          }
        }
      },
      logo: {
        url: "agflow-logo.svg",
        width: 100,
        height: 50,
        x: 'right',
        y: 'bottom',
        opacity: 0.5
      },
      point: {
        onMouseover: "singlePoint",
        onMouseout: "singlePoint",
        r: 4,
        mode: 'empty',
        color: "munin",
        stroke: {
          width: 1
        }
      },
      axis: {
        x: {
          format: null,
          tickSize: null,
          orient: "bottom",
          tickColor: "#f5f5f5",
          tickWidth: 2,
          strokeWidth: 1,
          color: "#2b2e33"
        },
        y: {
          format: null,
          tickSize: null,
          orient: "left",
          tickColor: "#f5f5f5",
          tickWidth: 2,
          strokeWidth: 1,
          color: "#2b2e33"
        }
      }
    };
    this._CANVAS = void 0;
    this._TOOLTIP = void 0;
    this._SCALE = {
      x: void 0,
      y: void 0
    };
    this.defaultConfig(args.config);
    this._SERIES = this.prepareSeries(args.series);
    this.computePadding();
    this.computeScales();
    return;
  }

  Main.prototype.updateObject = function(obj1, obj2, replace) {
    var isNode, update;
    if (replace == null) {
      replace = true;
    }
    isNode = function(obj) {
      var _ref;
      if ((obj != null ? (_ref = obj["0"]) != null ? _ref.nodeName : void 0 : void 0) != null) {
        return true;
      }
      return false;
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
          } else if (typeof obj2[k] === 'object') {
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

  Main.prototype.defaultConfig = function(c) {
    if (c == null) {
      c = {};
    }
    this.updateObject(this._CONF, c);
    return this._CONF;
  };

  Main.prototype.effects = {
    singlePoint: {
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
    },
    multipleVertical: {
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
    },
    multipleVerticalInverted: {
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
    }
  };

  Main.prototype.toString = function() {
    console.log("Canvas in " + this._CONF.selector);
    console.log("Config", this._CONF);
    console.log("Datas:", this._SERIES);
  };

  Main.prototype.computePadding = function() {
    var pad;
    pad = this._CONF.point.r + this._CONF.point.stroke.width / 2.0;
    if (this._CONF.canvas.padding === 'auto') {
      return this._CONF.canvas.padding = [pad, pad];
    }
  };

  Main.prototype.getDomain = function() {
    var maxX, maxY, minX, minY, point, serie, _i, _j, _len, _len1, _ref, _ref1;
    maxX = maxY = Number.MIN_VALUE;
    minX = minY = Number.MAX_VALUE;
    _ref = this._SERIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      serie = _ref[_i];
      _ref1 = serie.data;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        point = _ref1[_j];
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

  Main.prototype.computeScales = function() {
    var _canvas, _domain, _pad;
    _canvas = this._CONF.canvas;
    _pad = _canvas.padding;
    _domain = this.getDomain();
    this._SCALE.width = d3.scale.linear();
    if (this._CONF.axis.x.format != null) {
      this._SCALE.width = d3.time.scale();
    }
    this._SCALE.width.domain([_domain.minX, _domain.maxX]).nice().range([_pad[0], _canvas.width - _pad[0]]);
    this._SCALE.height = d3.scale.linear();
    if (this._CONF.axis.y.format != null) {
      this._SCALE.height = d3.time.scale();
    }
    return this._SCALE.height.domain([_domain.minY, _domain.maxY]).nice().range([_canvas.height - _pad[1], _pad[1]]);
  };

  Main.prototype.createCanvas = function() {
    if (this._CONF.canvas.selector == null) {
      throw new Error("No selector defined");
    }
    return this._CANVAS = d3.select(this._CONF.canvas.selector).append('svg').attr("fill", this._CONF.canvas.bgcolor).attr('width', this._CONF.canvas.width).attr('height', this._CONF.canvas.height);
  };

  Main.prototype.renderTitle = function(params) {
    var _ref, _ref1;
    if (params == null) {
      params = {
        title: null,
        padding: null
      };
    }
    return this._CANVAS.append("text").attr("x", (_ref1 = params.title.position.x) != null ? _ref1 : params.padding[0] - 1).attr("y", (_ref = params.title.position.y) != null ? _ref : params.padding[1] - 1).attr("class", "chart-title").attr("fill", params.title.color).attr("font-size", params.title.size).text(params.title.text);
  };

  Main.prototype.renderLabel = function(params) {
    if (params == null) {
      params = {
        label: {
          color: null,
          size: null,
          trans: null,
          text: "",
          textAnchor: ""
        },
        "class": null
      };
    }
    return this._CANVAS.append("text").attr("fill", params.label.color).attr("class", "label " + params["class"]).attr("font-size", params.label.size + "px").attr("text-anchor", params.label.textAnchor).attr("transform", params.label.trans).text(params.label.text);
  };

  Main.prototype.renderAxis = function(params) {
    var line;
    line = this._CANVAS.append("line").attr("stroke", params.axis.color).attr("stroke-width", params.axis.strokeWidth);
    switch (params.axis.orient) {
      case 'bottom':
        return line.attr("x1", params.canvas.padding[0]).attr("y1", params.canvas.height - params.canvas.padding[1]).attr("x2", params.canvas.width - params.canvas.padding[0]).attr("y2", params.canvas.height - params.canvas.padding[1]);
      case "top":
        return line.attr("x1", params.canvas.padding[0]).attr("y1", params.canvas.padding[1]).attr("x2", params.canvas.width - params.canvas.padding[0]).attr("y2", params.canvas.padding[1]);
      case "left":
        return line.attr("x1", params.canvas.padding[0]).attr("y1", params.canvas.padding[1]).attr("x2", params.canvas.padding[0]).attr("y2", params.canvas.height - params.canvas.padding[1]);
      case "right":
        return line.attr("x1", params.canvas.width - params.canvas.padding[0]).attr("y1", params.canvas.padding[1]).attr("x2", params.canvas.width - params.canvas.padding[0]).attr("y2", params.canvas.height - params.canvas.padding[1]);
      default:
        throw new Error("Unknown orientation: ", params.axis.orient);
    }
  };

  Main.prototype.renderGrid = function(params) {
    var ggrid, grid;
    if (params == null) {
      params = {
        "class": null,
        color: null,
        scale: null,
        height: null,
        width: null,
        padding: null,
        orient: null,
        trans: null,
        label: null,
        format: null
      };
    }
    grid = d3.svg.axis().scale(params.scale).orient(params.orient).tickSize(params.tickSize);
    if (params.format != null) {
      grid.ticks(d3.time.months, 1);
      grid.tickFormat(d3.time.format(params.format));
    }
    ggrid = this._CANVAS.append("g").attr("transform", params.trans).attr("class", "axis " + params["class"]).call(grid);
    this.renderLabel(params);
    ggrid.selectAll("line").attr("stroke", params.color).attr("stroke-width", params.strokeWidth);
    ggrid.selectAll("line").attr("stroke", params.tickColor).attr("width-stroke", params.tickWidth);
    ggrid.selectAll("path").style("display", "none");
    return ggrid.selectAll("text").attr("fill", params.label.color).attr("font-size", params.label.size);
  };

  Main.prototype.renderXGrid = function() {
    var height, label, padding, params, tickSize, trans, width;
    padding = this._CONF.canvas.padding[1];
    height = this._CONF.canvas.height;
    width = this._CONF.canvas.width;
    label = this._CONF.canvas.label.x;
    label.textAnchor = "middle";
    switch (this._CONF.axis.x.orient) {
      case 'bottom':
        trans = "translate(0, " + padding + ")";
        label.trans = "translate(" + (width / 2) + ", " + (height - 2) + ")";
        break;
      case 'top':
        trans = "translate(0, " + (height - padding) + ")";
        label.trans = "translate(" + (width / 2) + ", " + (padding / 2) + ")";
        break;
      default:
        throw new Error("Unknown orientation: ", this._CONF.axis.x.orient);
    }
    tickSize = this._CONF.axis.x.tickSize;
    if (tickSize === 'full') {
      tickSize = height - padding * 2;
    }
    params = {
      "class": "x",
      height: this._CONF.canvas.height,
      width: this._CONF.canvas.width / 2,
      scale: this._SCALE.width,
      tickSize: tickSize,
      padding: padding,
      label: label,
      orient: this._CONF.axis.x.orient,
      trans: trans,
      tickColor: this._CONF.axis.x.tickColor,
      tickWidth: this._CONF.axis.x.tickWidth,
      color: this._CONF.axis.x.color,
      strokeWidth: this._CONF.axis.x.strokeWidth,
      format: this._CONF.axis.x.format
    };
    return this.renderGrid(params);
  };

  Main.prototype.renderYGrid = function() {
    var height, label, padding, params, tickSize, trans, width;
    padding = this._CONF.canvas.padding[0];
    height = this._CONF.canvas.height;
    width = this._CONF.canvas.width;
    label = this._CONF.canvas.label.y;
    switch (this._CONF.axis.y.orient) {
      case 'left':
        trans = "translate(" + padding + ", 0)";
        label.trans = "rotate(-90) translate(" + (-height / 2) + ", " + (padding + 10) + ")";
        break;
      case 'right':
        trans = "translate(" + (width - padding) + ", 0)";
        label.trans = "translate(" + (width - padding) + ", " + (padding / 2) + ")";
        label.textAnchor = "end";
        break;
      default:
        throw new Error("Unknown orientation: ", this._CONF.axis.y.orient);
    }
    tickSize = this._CONF.axis.y.tickSize;
    if (tickSize === 'full') {
      tickSize = -width + padding * 2;
    }
    params = {
      "class": "y",
      height: this._CONF.canvas.height,
      width: this._CONF.canvas.width,
      scale: this._SCALE.height,
      tickSize: tickSize,
      padding: padding,
      label: label,
      orient: this._CONF.axis.y.orient,
      trans: trans,
      tickColor: this._CONF.axis.y.tickColor,
      tickWidth: this._CONF.axis.y.tickWidth,
      color: this._CONF.axis.y.color,
      strokeWidth: this._CONF.axis.y.strokeWidth,
      format: this._CONF.axis.y.format
    };
    return this.renderGrid(params);
  };

  Main.prototype.prepareSeries = function(data) {
    var i, point, serie, _i, _j, _len, _len1, _palette, _ref, _ref1, _ref2, _ref3, _ref4;
    _palette = new palette.Main(this._CONF.point.color);
    for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
      serie = data[i];
      _ref = serie.data;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        point = _ref[_j];
        point.serie = i;
        point.config = {};
        point.config.color = this._CONF.point.color;
        if (_palette.isDefined()) {
          point.config.color = _palette.color(i);
        }
        if (((_ref1 = serie.config) != null ? _ref1.color : void 0) != null) {
          point.config.color = serie.config.color;
        }
        point.config.r = ((_ref2 = serie.config) != null ? _ref2.r : void 0) || this._CONF.point.r;
        point.config.stroke = {
          width: this._CONF.point.stroke.width
        };
        if (((_ref3 = serie.config) != null ? (_ref4 = _ref3.stroke) != null ? _ref4.width : void 0 : void 0) != null) {
          point.config.stroke.width = serie.config.stroke.width;
        }
      }
    }
    return data;
  };

  Main.prototype.renderPoints = function() {
    var scaleH, scaleW, series, valueline, _canvas, _conf, _effects, _scope, _tooltipCallback, _tooltipHide, _tooltipNode, _tooltipShow, _tooltipTemplate;
    _scope = this;
    _conf = this._CONF;
    _canvas = this._CANVAS;
    _effects = this.effects;
    _tooltipShow = this.tooltip.show;
    _tooltipHide = this.tooltip.hide;
    _tooltipNode = this._TOOLTIP;
    _tooltipCallback = _conf.tooltip.callback;
    _tooltipTemplate = _conf.tooltip.template;
    if (typeof _tooltipCallback === "string") {
      _tooltipCallback = this.tooltip.callbacks[_tooltipCallback];
    }
    if (typeof _tooltipTemplate === "string") {
      _tooltipTemplate = this.tooltip.templates[_tooltipTemplate];
    }
    scaleW = this._SCALE.width;
    scaleH = this._SCALE.height;
    series = this._CANVAS.selectAll(".series").data(this._SERIES).enter().append("g").attr("class", "series").attr("id", function(s, i) {
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
      })).attr("fill", "none");
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
        var data, effect;
        effect = _conf.point.onMouseover;
        if (typeof effect === 'string') {
          effect = _effects[effect].onMouseover;
        }
        effect({
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
        return _tooltipShow(this, {
          canvas: {
            width: _conf.canvas.width,
            height: _conf.canvas.height
          },
          tooltip: {
            alwaysInside: _conf.tooltip.alwaysInside
          }
        }, _tooltipNode, d);
      }).on('mouseout', function(d) {
        var effect;
        effect = _conf.point.onMouseout;
        if (typeof effect === 'string') {
          effect = _effects[effect].onMouseout;
        }
        effect({
          canvas: _canvas,
          circleNode: this,
          data: d
        });
        return _tooltipHide(_tooltipNode);
      });
    } else {
      throw new Error("Unknown render value '" + _canvas.render + "'");
    }
  };

  Main.prototype.renderTooltip = function() {
    if (this._TOOLTIP == null) {
      return this._TOOLTIP = d3.select(this._CONF.canvas.selector).append("div").attr('class', 'tooltip').style('opacity', 0).attr('left', 0).attr('top', 0);
    }
  };

  Main.prototype.renderCrossValue = function(params) {
    var box, gbox, text;
    if (params == null) {
      params = {
        scale: null,
        canvas: null,
        confCanvas: null,
        confCrossV: null
      };
    }
    gbox = params.canvas.append("g").attr("transform", "translate(-1000, -1000)");
    box = gbox.append("rect").attr("fill", params.confCrossV.x.color).attr("rx", params.confCrossV.x.radius).attr("ry", params.confCrossV.x.radius);
    text = gbox.append("text").text("AgChartPile").attr("font-size", params.confCrossV.x.fontSize).attr("text-anchor", "middle").attr("fill", params.confCrossV.x.fontColor);
    if (params.confCrossV.x.show) {
      return params.canvas.on("mousemove.crossValue", function() {
        var eventX, eventY, textDim, valueX;
        eventX = d3.mouse(this)[0];
        textDim = [text[0][0].clientWidth + 30, text[0][0].clientHeight + 2];
        if (eventX < params.confCanvas.padding[0]) {
          eventX = params.confCanvas.padding[0];
        }
        if (eventX > params.confCanvas.width - params.confCanvas.padding[0]) {
          eventX = params.confCanvas.width - params.confCanvas.padding[0];
        }
        text.attr("y", textDim[1] - 4).attr("x", textDim[0] / 2);
        box.attr("width", textDim[0]).attr("height", textDim[1]);
        valueX = params.scale.width.invert(eventX);
        switch (params.confCrossV.x.orient) {
          case 'top':
            eventY = params.confCanvas.padding[1];
            break;
          case 'bottom':
            eventY = params.confCanvas.height - params.confCanvas.padding[1];
        }
        text.text(params.confCrossV.x.format(valueX));
        gbox.attr("transform", "translate(" + (eventX - textDim[0] / 2) + ", " + eventY + ")");
        return gbox.attr("cy", d3.mouse(this)[1]);
      });
    }
  };

  Main.prototype.renderCross = function(params) {
    var height, offsetX, offsetY, padX, padY, width, _crossX, _crossY;
    if (params == null) {
      params = {
        canvas: nulle,
        confCanvas: null,
        confCross: null
      };
    }
    padX = params.confCanvas.padding[0];
    padY = params.confCanvas.padding[1];
    offsetX = params.confCross.x.offset;
    offsetY = params.confCross.y.offset;
    width = params.confCanvas.width;
    height = params.confCanvas.height;
    _crossX = params.canvas.append("line").attr("class", "crossX").attr("x1", -width).attr("y1", padY).attr("x2", -width).attr("y2", height - padY).attr("stroke", params.confCross.x.color).attr("stroke-width", params.confCross.x.stroke);
    _crossY = params.canvas.append("line").attr("class", "crossY").attr("x1", padX).attr("y1", -height).attr("x2", width - padX).attr("y2", -height).attr("stroke", params.confCross.y.color).attr("stroke-width", params.confCross.y.stroke);
    return params.canvas.on("mousemove.tooltip", function(d) {
      var eventX, eventY;
      eventX = d3.mouse(this)[0];
      eventY = d3.mouse(this)[1];
      if (params.confCross.x.show && eventX >= padX + offsetX && eventX <= width - padX + offsetX) {
        _crossX.attr("x1", eventX - offsetX).attr("x2", eventX - offsetX);
      }
      if (params.confCross.y.show && eventY >= padY + offsetY && eventY <= height - padY + offsetY) {
        return _crossY.attr("y1", eventY - offsetY).attr("y2", eventY - offsetY);
      }
    });
  };

  Main.prototype.renderLogo = function(params) {
    if (params.y === 'bottom') {
      params.y = this._CONF.canvas.height - this._CONF.canvas.padding[0] - params.height;
    }
    if (params.y === 'top') {
      params.y = this._CONF.canvas.padding[0];
    }
    if (params.x === 'right') {
      params.x = this._CONF.canvas.width - this._CONF.canvas.padding[1] - params.width;
    }
    if (params.y === 'left') {
      params.x = this._CONF.canvas.padding[1];
    }
    return this._CANVAS.append("image").attr("width", params.width).attr("height", params.height).attr("x", params.x).attr("y", params.y).attr("opacity", params.opacity).attr("xlink:href", this._CONF.logo.url);
  };

  Main.prototype.render = function() {
    if (this._CANVAS == null) {
      this._CANVAS = this.createCanvas();
    }
    this.renderLogo({
      opacity: this._CONF.logo.opacity,
      url: this._CONF.logo.url,
      width: this._CONF.logo.width,
      height: this._CONF.logo.height,
      x: this._CONF.logo.x,
      y: this._CONF.logo.y
    });
    this.renderCross({
      canvas: this._CANVAS,
      confCanvas: this._CONF.canvas,
      confCross: this._CONF.canvas.cross
    });
    this.renderXGrid();
    this.renderYGrid();
    this.renderAxis({
      canvas: this._CONF.canvas,
      axis: this._CONF.axis.x
    });
    this.renderAxis({
      canvas: this._CONF.canvas,
      axis: this._CONF.axis.y
    });
    this.renderCrossValue({
      scale: this._SCALE,
      canvas: this._CANVAS,
      confCanvas: this._CONF.canvas,
      confCrossV: this._CONF.canvas.crossValue
    });
    this.renderTooltip();
    this.renderPoints();
    return this.renderTitle({
      title: this._CONF.canvas.title,
      padding: this._CONF.canvas.padding
    });
  };

  Main.prototype.tooltip = {
    show: function(context, conf, tooltipNode, d) {
      var eventX, eventY, heightTooltip, left, top, widthTooltip;
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
    },
    hide: function(tooltipNode) {
      return tooltipNode.transition().duration(500).style("opacity", 0);
    },
    templates: {
      singlePoint: function(data) {
        return ("<div>" + data[0].serieName) + "<div class='swatch'" + ("style='background-color: " + data[0].color + "'></div>") + "</div>" + ("<div>" + data[0].x + " " + data[0].y + "</div>");
      },
      multipleVertical: function(data) {
        var d, html, _i, _len;
        html = "";
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          html += ("<div>" + d.serieName) + "<div class='swatch'" + ("style='background-color: " + d.color + "'></div>") + "</div>" + ("<div>" + d.x + " " + d.y + "</div>");
        }
        return html;
      },
      multipleVerticalInverted: function(data) {
        var d, html, _i, _len;
        html = "" + data[0].x;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          html += ("<div>" + d.serieName + ": " + d.y) + "<div class='swatch'" + ("style='background-color: " + d.color + "'></div>") + "</div>";
        }
        return html;
      }
    },
    callbacks: {
      singlePoint: function(params) {
        var x, _circleNode, _ref;
        _circleNode = params.circleNode;
        x = parseFloat(_circleNode.getAttribute('data-x'));
        if (((_ref = params.format) != null ? _ref.x : void 0) != null) {
          x = params.format.x(x);
        }
        return [
          {
            color: params.data.config.color,
            serieName: params.circleNode.parentNode.getAttribute("title"),
            x: x,
            y: params.data.y.toFixed(2)
          }
        ];
      },
      multipleVertical: function(params) {
        var cx, res, x, _circleNode, _ref;
        _circleNode = params.circleNode;
        cx = _circleNode.getAttribute('cx');
        x = parseFloat(_circleNode.getAttribute('data-x'));
        if (((_ref = params.format) != null ? _ref.x : void 0) != null) {
          x = params.format.x(x);
        }
        res = [];
        $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
          return res.push({
            serieName: node.parentNode.getAttribute("title"),
            color: node.getAttribute("data-color"),
            y: parseFloat(node.getAttribute("data-y")).toFixed(2),
            x: x
          });
        });
        return res;
      },
      multipleVerticalInverted: function(params) {
        var cx, res, x, _circleNode, _ref;
        _circleNode = params.circleNode;
        cx = _circleNode.getAttribute('cx');
        x = parseFloat(_circleNode.getAttribute('data-x'));
        if (((_ref = params.format) != null ? _ref.x : void 0) != null) {
          x = params.format.x(x);
        }
        res = [];
        $(params.canvas[0]).find("circle[cx='" + cx + "']").each(function(e, node) {
          return res.push({
            serieName: node.parentNode.getAttribute("title"),
            color: node.getAttribute("data-color"),
            y: parseFloat(node.getAttribute("data-y")).toFixed(2),
            x: x
          });
        });
        return res;
      }
    }
  };

  return Main;

})();
});

;require.register("initialize", function(exports, require, module) {
var agchart, exp, genData, genDataFunc, time;

module.exports = exp = {};

agchart = require('agchart');

time = require('utils/time');

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
  var agChart, mode, t, tooltipFormat, tooltipTemplate;
  t = new time.Main({
    lang: 'en'
  });
  tooltipFormat = function(d) {
    var date, formatDate;
    date = new Date(d);
    formatDate = d3.time.format("%b '%y");
    return formatDate(date);
  };
  tooltipTemplate = function(d) {
    return console.log(d);
  };
  mode = "multipleVerticalInverted";
  agChart = new agchart.Main({
    config: {
      canvas: {
        render: 'dotline',
        width: 600.0,
        height: 400.0,
        title: {
          color: "#4f4f4f",
          size: 20,
          text: "AgChart"
        },
        label: {
          x: {
            text: "Some label X",
            size: 10,
            color: "#7f7f7f"
          },
          y: {
            text: "Some label Y",
            size: 10,
            color: "#7f7f7f"
          }
        },
        selector: '#chart1',
        padding: [30, 30],
        cross: {
          x: {
            show: true,
            color: "#44A0FF"
          },
          y: {
            show: true,
            color: "#FFA044"
          }
        }
      },
      logo: {
        url: "agflow-logo.png",
        width: 100,
        height: 50,
        x: 'right',
        y: 'bottom',
        opacity: 0.3
      },
      tooltip: {
        template: mode,
        callback: mode,
        format: {
          x: tooltipFormat
        }
      },
      point: {
        onMouseover: mode,
        onMouseout: mode,
        mode: 'fill',
        r: 3,
        color: 'paired',
        stroke: {
          width: 1,
          color: null
        }
      },
      axis: {
        y: {
          tickSize: "full",
          tickColor: "#ebebeb",
          tickWidth: 2,
          orient: "right"
        },
        x: {
          orient: "bottom",
          tickWidth: 2,
          tickColor: "#ebebeb",
          format: "%b",
          tickSize: "full"
        }
      }
    },
    series: [
      {
        name: "Serie 1",
        data: genDataFunc(24 * 3600 * 120, 36 * 3600, function(d) {
          return Math.cos(d) * 10;
        }),
        config: {
          stroke: {
            width: 1
          }
        }
      }, {
        name: "Serie 2",
        data: genDataFunc(24 * 3600 * 120, 36 * 3600 * 2, Math.tan),
        config: {
          color: "#ff0001",
          stroke: {
            width: 1
          }
        }
      }, {
        name: "Serie 3",
        data: genDataFunc(24 * 3600 * 120, 48 * 3600, Math.sin),
        config: {
          stroke: {
            width: 1
          }
        }
      }
    ]
  });
  return agChart.render();
};
});

;require.register("utils/palette", function(exports, require, module) {
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
    return schemes;
  };

  return Main;

})();
});

;require.register("utils/time", function(exports, require, module) {
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
    this._MONTHSNAME.fr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    this._MONTHSNAME.frl = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
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

;
//# sourceMappingURL=agchart.js.map