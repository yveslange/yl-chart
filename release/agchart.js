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
          text: "",
          color: "#2f2f2f",
          size: 24,
          fontFamily: "arial",
          border: {
            radius: 2,
            color: "#3f3f3f",
            padding: [8, 1]
          },
          position: {
            x: 35,
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
            show: false,
            color: 'black',
            stroke: 1,
            offset: 0
          },
          y: {
            show: false,
            color: 'black',
            stroke: 1,
            offset: 0
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
      line: {
        stroke: {
          width: 2
        }
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
          ticks: "auto",
          tickSize: null,
          orient: "bottom",
          tickColor: "#f5f5f5",
          tickWidth: 2,
          strokeWidth: 1,
          color: "#2b2e33",
          font: {
            color: "#2b2e33",
            size: 10,
            weight: "normal"
          }
        },
        y: {
          format: null,
          ticks: "auto",
          tickSize: null,
          orient: "left",
          tickColor: "#f5f5f5",
          tickWidth: 2,
          strokeWidth: 1,
          color: "#2b2e33",
          font: {
            color: "#2b2e33",
            size: 10,
            weight: "normal"
          }
        }
      },
      legends: {
        show: true
      },
      plugins: {
        exportation: {
          enable: true,
          copyright: {
            text: "(c) AgFlow 2014",
            color: "#9f9f9f",
            fontSize: 12
          }
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
    this._SCALE.width.domain([_domain.minX, _domain.maxX]).range([_pad[0], _canvas.width - _pad[0]]);
    if (_canvas.scale.x.nice) {
      this._SCALE.width.nice();
    }
    this._SCALE.height = d3.scale.linear();
    if (this._CONF.axis.y.format != null) {
      this._SCALE.height = d3.time.scale();
    }
    this._SCALE.height.domain([_domain.minY, _domain.maxY]).range([_canvas.height - _pad[1], _pad[1]]);
    if (_canvas.scale.y.nice) {
      return this._SCALE.height.nice();
    }
  };

  Main.prototype.createCanvas = function() {
    if (this._CONF.canvas.selector == null) {
      throw new Error("No selector defined");
    }
    $(this._CONF.canvas.selector).css({
      "position": "relative"
    });
    return this._CANVAS = d3.select(this._CONF.canvas.selector).append('svg').attr("fill", this._CONF.canvas.bgcolor).attr('width', this._CONF.canvas.width).attr('height', this._CONF.canvas.height);
  };

  Main.prototype.renderTitle = function(params) {
    var gbox, posX, posY, rect, text, textDim;
    if (params == null) {
      params = {
        title: null,
        padding: null
      };
    }
    posX = params.title.position.x;
    posY = params.title.position.y;
    gbox = this._CANVAS.append("g").attr("transform", "translate(" + posX + "," + posY + ")");
    rect = gbox.append("rect");
    text = gbox.append("text").attr("class", "chart-title").attr("fill", params.title.color).attr("font-size", params.title.size).attr("font-weight", "bold").attr("font-family", params.title.fontFamily).text(params.title.text);
    textDim = text.node().getBBox();
    text.attr("x", params.title.border.padding[0]).attr("y", textDim.height - params.title.border.padding[1] - 2);
    if (params.title.text) {
      return rect.attr("width", textDim.width + params.title.border.padding[0] * 2).attr("height", textDim.height + params.title.border.padding[1] * 2).attr("ry", params.title.border.radius).attr("rx", params.title.border.radius).attr("stroke", params.title.border.color);
    }
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
    if (params.ticks !== "auto") {
      grid.ticks(params.ticks);
    }
    if (params.format != null) {
      if (params.ticks === "auto") {
        grid.ticks(d3.time.months, 1);
      } else {
        grid.ticks(d3.time.months, params.ticks);
      }
      grid.tickFormat(d3.time.format(params.format));
    }
    ggrid = this._CANVAS.append("g").attr("transform", params.trans).attr("class", "axis " + params["class"]).call(grid);
    this.renderLabel(params);
    ggrid.selectAll("line").attr("stroke", params.color).attr("stroke-width", params.strokeWidth);
    ggrid.selectAll("line").attr("stroke", params.tickColor).attr("width-stroke", params.tickWidth);
    ggrid.selectAll("path").style("display", "none");
    return ggrid.selectAll("text").attr("fill", params.fontColor).attr("font-size", params.fontSize).attr("font-weight", params.fontWeight);
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
      ticks: this._CONF.axis.x.ticks,
      tickSize: tickSize,
      padding: padding,
      label: label,
      orient: this._CONF.axis.x.orient,
      trans: trans,
      tickColor: this._CONF.axis.x.tickColor,
      tickWidth: this._CONF.axis.x.tickWidth,
      color: this._CONF.axis.x.color,
      strokeWidth: this._CONF.axis.x.strokeWidth,
      format: this._CONF.axis.x.format,
      fontSize: this._CONF.axis.x.font.size,
      fontColor: this._CONF.axis.x.font.color,
      fontWeight: this._CONF.axis.x.font.weight
    };
    return this.renderGrid(params);
  };

  Main.prototype.renderYGrid = function() {
    var height, label, padding, params, tickSize, trans, width;
    padding = this._CONF.canvas.padding;
    height = this._CONF.canvas.height;
    width = this._CONF.canvas.width;
    label = this._CONF.canvas.label.y;
    switch (this._CONF.axis.y.orient) {
      case 'left':
        trans = "translate(" + padding[0] + ", 0)";
        label.trans = "rotate(-90) translate(" + (-height / 2) + ", " + (padding[0] + 10) + ")";
        break;
      case 'right':
        trans = "translate(" + (width - padding[0]) + ", 0)";
        label.trans = "translate(" + (width - padding[0]) + ", " + (padding[1] / 2) + ")";
        label.textAnchor = "middle";
        break;
      default:
        throw new Error("Unknown orientation: ", this._CONF.axis.y.orient);
    }
    tickSize = this._CONF.axis.y.tickSize;
    if (tickSize === 'full') {
      tickSize = -width + padding[0] * 2;
    }
    params = {
      "class": "y",
      height: this._CONF.canvas.height,
      width: this._CONF.canvas.width,
      scale: this._SCALE.height,
      ticks: this._CONF.axis.y.ticks,
      tickSize: tickSize,
      padding: padding,
      label: label,
      orient: this._CONF.axis.y.orient,
      trans: trans,
      tickColor: this._CONF.axis.y.tickColor,
      tickWidth: this._CONF.axis.y.tickWidth,
      color: this._CONF.axis.y.color,
      strokeWidth: this._CONF.axis.y.strokeWidth,
      format: this._CONF.axis.y.format,
      fontSize: this._CONF.axis.y.font.size,
      fontColor: this._CONF.axis.y.font.color,
      fontWeight: this._CONF.axis.y.font.weight
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
    var box, gbox, text, textDim, timeoutUnmoved;
    if (params == null) {
      params = {
        scale: null,
        canvas: null,
        confCanvas: null,
        confCrossV: null
      };
    }
    gbox = params.canvas.append("g").style("opacity", 0);
    box = gbox.append("rect");
    text = gbox.append("text").text("AgChartPile").attr("font-size", params.confCrossV.x.fontSize).attr("text-anchor", "middle").attr("fill", params.confCrossV.x.fontColor);
    textDim = text.node().getBBox();
    box.attr("fill", params.confCrossV.x.color).attr("rx", params.confCrossV.x.radius).attr("ry", params.confCrossV.x.radius);
    if (params.confCrossV.x.show) {
      timeoutUnmoved = null;
      return params.canvas.on("mousemove.crossValue", function() {
        var eventX, eventY, positionX, valueX;
        gbox.transition().duration(300).style('opacity', 1);
        clearTimeout(timeoutUnmoved);
        eventX = d3.mouse(this)[0];
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
        valueX = params.scale.width.invert(eventX);
        switch (params.confCrossV.x.orient) {
          case 'top':
            eventY = params.confCanvas.padding[1];
            break;
          case 'bottom':
            eventY = params.confCanvas.height - params.confCanvas.padding[1];
        }
        text.text(params.confCrossV.x.format(valueX));
        gbox.attr("transform", "translate(" + (positionX - textDim.width / 2) + ", " + eventY + ")");
        gbox.attr("cy", d3.mouse(this)[1]);
        return timeoutUnmoved = setTimeout((function() {
          return gbox.transition().duration(500).style('opacity', 0);
        }), 2000);
      });
    }
  };

  Main.prototype.renderCross = function(params) {
    var height, offsetX, offsetY, padX, padY, timeoutUnmoved, width, _crossX, _crossY;
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
    timeoutUnmoved = null;
    return params.canvas.on("mousemove.tooltip", function(d) {
      var eventX, eventY;
      clearTimeout(timeoutUnmoved);
      _crossY.transition().style('opacity', 1);
      _crossX.transition().style('opacity', 1);
      eventX = d3.mouse(this)[0];
      eventY = d3.mouse(this)[1];
      if (params.confCross.x.show && eventX >= padX + offsetX && eventX <= width - padX + offsetX) {
        _crossX.attr("x1", eventX - offsetX).attr("x2", eventX - offsetX);
      }
      if (params.confCross.y.show && eventY >= padY + offsetY && eventY <= height - padY + offsetY) {
        _crossY.attr("y1", eventY - offsetY).attr("y2", eventY - offsetY);
      }
      return timeoutUnmoved = setTimeout((function() {
        _crossY.transition().duration(500).style('opacity', 0);
        return _crossX.transition().duration(500).style('opacity', 0);
      }), 2000);
    });
  };

  Main.prototype.renderLogo = function(params) {
    if (params.y === 'bottom') {
      params.y = this._CONF.canvas.height - this._CONF.canvas.padding[1] - params.height;
    }
    if (params.y === 'top') {
      params.y = this._CONF.canvas.padding[1];
    }
    if (params.x === 'right') {
      params.x = this._CONF.canvas.width - this._CONF.canvas.padding[0] - params.width;
    }
    if (params.y === 'left') {
      params.x = this._CONF.canvas.padding[0];
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
    this.renderTitle({
      title: this._CONF.canvas.title,
      padding: this._CONF.canvas.padding
    });
    this.renderPluginMenu({
      selector: this._CONF.canvas.selector,
      confPlugins: this._CONF.plugins
    });
    if (this._CONF.legends.show) {
      return this.renderLegends();
    }
  };

  Main.prototype.renderLegends = function() {
    var color, currentX, currentY, i, legPanel, legend, posX, posY, rect, rectHeight, rectMargin, rectWidth, selector, serie, textWidth, widthSpace, _ref, _results;
    selector = this._CONF.canvas.selector;
    rectWidth = 30;
    rectHeight = 10;
    textWidth = 100;
    rectMargin = 2;
    widthSpace = this._CONF.canvas.width - this._CONF.canvas.padding[0] * 2;
    posX = this._CONF.canvas.padding[0];
    posY = this._CONF.canvas.height - 12;
    currentX = 0;
    currentY = 15;
    legPanel = this._CANVAS.append("g").attr("transform", "translate(" + posX + ", " + posY + ")");
    _ref = this._SERIES;
    _results = [];
    for (i in _ref) {
      serie = _ref[i];
      this._CANVAS.attr("height", this._CONF.canvas.height + currentY);
      i = parseInt(i);
      color = serie.data[0].config.color;
      legend = legPanel.append("g").attr("transform", "translate(" + currentX + ", " + currentY + ")").style("cursor", "pointer").attr("data-serieIndex", i).attr("data-hide", "false");
      rect = legend.append("rect").attr("width", rectWidth).attr("height", 10).attr("fill", color).attr("stroke", "#afafaf").attr("stroke-width", "1");
      legend.append("text").attr("x", rectMargin + rectWidth).attr("y", 10).attr("fill", "#3f3f3f").attr("font-size", 10).text(serie.name);
      if (currentX + rectWidth + textWidth + rectMargin > widthSpace - rectWidth - textWidth - rectMargin) {
        currentX = 0;
        currentY += 15;
      } else {
        currentX += rectWidth + textWidth + rectMargin;
      }
      _results.push(legend.on("click", function() {
        var hide, opacity;
        opacity = $(this).css("opacity");
        serie = this.getAttribute("data-serieIndex");
        hide = this.getAttribute("data-hide");
        $(selector).find(".series#" + serie).toggle();
        if (hide === "false") {
          $(this).fadeTo(100, 0.3);
          return this.setAttribute("data-hide", "true");
        } else {
          $(this).fadeTo(100, 1);
          return this.setAttribute("data-hide", "false");
        }
      }));
    }
    return _results;
  };

  Main.prototype.renderPluginMenu = function(params) {
    var callback, context, icon, plugin, pluginsMenu, _results;
    if (params == null) {
      params = {
        selector: null,
        confPlugins: {}
      };
    }
    pluginsMenu = $("<div/>", {
      id: "pluginsMenu"
    }).appendTo(params.selector);
    pluginsMenu.css({
      "position": "absolute",
      "left": this._CONF.canvas.width + 1,
      "top": "0px",
      "opacity": 0.1
    });
    pluginsMenu.on("mouseover.menuPlugin", function() {
      return pluginsMenu.animate({
        opacity: 1
      }, 10);
    });
    pluginsMenu.on("mouseout.menuPlugin", function() {
      return pluginsMenu.animate({
        opacity: 0.1
      }, 10);
    });
    _results = [];
    for (plugin in params.confPlugins) {
      if (params.confPlugins[plugin].enable) {
        icon = $("<img/>", {
          src: "icons/" + plugin + ".png",
          width: "30px"
        }).appendTo(pluginsMenu);
        icon.css({
          cursor: "pointer"
        });
        callback = this.plugins[plugin].onClick;
        context = this;
        _results.push(icon.click(function() {
          return callback(context, params.selector, params.confPlugins[plugin]);
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Main.prototype.plugins = {
    exportation: {
      onClick: function(context, selector, conf) {
        var a, canvas, height, image, img, pX, pY, svg, svg_xml, text, textDim, width;
        image = $(selector).find("image").remove();
        text = context._CANVAS.append("text").attr("fill", conf.copyright.color).attr("font-size", conf.copyright.fontSize + "px").text(conf.copyright.text);
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
        $("body").append(canvas);
        canvg(canvas, svg_xml);
        canvas.remove();
        img = canvas.toDataURL("image/png");
        a = document.createElement('a');
        a.href = img;
        a.download = "agflow.png";
        $("body").append(a);
        a.click();
        context.renderLogo({
          opacity: context._CONF.logo.opacity,
          url: context._CONF.logo.url,
          width: context._CONF.logo.width,
          height: context._CONF.logo.height,
          x: context._CONF.logo.x,
          y: context._CONF.logo.y
        });
        return text.remove();
      }
    }
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
        width: 900.0,
        height: 400.0,
        title: {
          color: "#4f4f4f",
          size: 16,
          text: null,
          border: {
            padding: [8, 1]
          }
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
        padding: [50, 50],
        cross: {
          x: {
            show: true,
            color: "#44A0FF"
          },
          y: {
            show: true,
            color: "#FFA044"
          }
        },
        crossValue: {
          x: {
            show: true
          }
        }
      },
      logo: {
        url: "agflow-logo.png",
        width: 100,
        height: 50,
        x: 'right',
        y: 'bottom',
        opacity: 0.1
      },
      tooltip: {
        template: mode,
        callback: mode,
        format: {
          x: tooltipFormat
        }
      },
      line: {
        stroke: {
          width: 2
        }
      },
      point: {
        onMouseover: mode,
        onMouseout: mode,
        mode: 'fill',
        r: 4,
        color: 'paired',
        stroke: {
          width: 1,
          color: null
        }
      },
      axis: {
        y: {
          ticks: 5,
          tickSize: "full",
          tickColor: "#ebebeb",
          tickWidth: 2,
          orient: "right",
          font: {
            weight: "bold"
          }
        },
        x: {
          ticks: 1,
          orient: "bottom",
          tickWidth: 2,
          tickColor: "#ebebeb",
          format: "%b",
          tickSize: "full"
        }
      },
      legends: {
        show: true
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