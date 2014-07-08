module.exports = exp = {}
M = {
  # Init
  config  : require 'agchart/config'
  tools   : require 'agchart/utils/tools'
  scale   : require 'agchart/utils/scale'
  domain  : require 'agchart/utils/domain'
  palette : require 'agchart/utils/palette'
  design  : require 'agchart/utils/design'
  effectsPoint : require 'agchart/effects/point'

  # Components
  title:    require 'agchart/components/title'
  tooltip:  require 'agchart/components/tooltip'
  logo:     require 'agchart/components/logo'
  legend:   require 'agchart/components/legend'
  cross:    require 'agchart/components/cross'
  axis:     require 'agchart/components/axis'
  grid:     require 'agchart/components/grid'

  # Plugins
  plugin:   require 'agchart/components/plugin'
}

exp.Main = class Main
  constructor: (args) ->
    # Loading default configuration merged with user
    # configuration
    @_CONF = new M.config.Main(args.config).get()
    @_PALETTE = new M.palette.Main(@_CONF.point.color)
    @_CANVAS = undefined # TODO: THIS IS A DOM, rename to SVG

    # Class components
    @_CLASS = {
      tooltip: undefined
      title: undefined
    }

    # TODO: We can't change args.series !
    # thus it must be the same after executing this function
    @_SERIES = M.tools.prepareSeries({
      series: args.series
      palette: @_PALETTE
      confPoint: @_CONF.point})

    # TODO: the auto mode is a bit broken
    if @_CONF.canvas.padding == 'auto'
      @_CONF.canvas.padding = M.design.computePadding(@_CONF.point)

    @_DOMAIN = M.domain.computeDomain(args.series)
    M.domain.fixDomain({
      domain: @_DOMAIN
      confAxis: @_CONF.axis
    })

    @_SCALE = M.scale.computeScales({
      confCanvas: @_CONF.canvas
      confAxis: @_CONF.axis
      domain: @_DOMAIN
    })

    @initSVG(@_CONF.canvas)

  # Returns information about the chart
  toString: ->
    console.log "Canvas in #{@_CONF.selector}"
    console.log "Config", @_CONF
    console.log "Classes:", @_CLASS
    console.log "Series:", @_SERIES
    return

  # Creating the SVG container in a predefined selector
  initSVG: (confCanvas) ->
    throw new Error("No selector defined") if not confCanvas.selector?
    $(confCanvas.selector).css({"position": "relative"})
    @_CANVAS = d3.select(confCanvas.selector)
      .append('svg')
      .attr("fill", confCanvas.bgcolor)
      .attr('width', confCanvas.width)
      .attr('height', confCanvas.height)
    @_CLASS.tooltip = new M.tooltip.Main(@_CONF.canvas.selector)
    @_CLASS.plugin  = new M.plugin.Main(@_CONF.canvas.selector)
    @_CLASS.title   = new M.title.Main(@_CANVAS)
    @_CLASS.logo    = new M.logo.Main(@_CANVAS)
    @_CLASS.axisX   = new M.axis.Main(@_CANVAS, @_CONF.canvas)
    @_CLASS.axisY   = new M.axis.Main(@_CANVAS, @_CONF.canvas)
    @_CLASS.cross   = new M.cross.Main(@_CANVAS)
    @_CLASS.legend  = new M.legend.Main(@_CANVAS)
    @_CLASS.gridX   = new M.grid.Main(@_CANVAS)
    @_CLASS.gridY   = new M.grid.Main(@_CANVAS)

  renderXGrid: ->
    padding = @_CONF.canvas.padding
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    label = @_CONF.canvas.label.x
    label.textAnchor = "middle"
    label.orient = @_CONF.axis.x.orient
    label.offset = @_CONF.canvas.label.x.offset
    switch @_CONF.axis.x.orient
      when 'bottom'
        trans = "translate(0, #{padding[1]})"
      when 'top'
        trans = "translate(0, #{height-padding[1]})"
      else
        throw new Error("Unknown orientation: ", @_CONF.axis.x.orient)
    tickSize = @_CONF.axis.x.tickSize
    tickSize =  height-padding[1]*2 if tickSize == 'full'
    params = {
      class: "x"
      height: @_CONF.canvas.height
      width: @_CONF.canvas.width
      scale: @_SCALE.x
      ticks: @_CONF.axis.x.ticks
      tickSize: tickSize
      padding: padding
      label: label
      orient: @_CONF.axis.x.orient
      trans: trans
      tickColor: @_CONF.axis.x.tickColor
      tickWidth: @_CONF.axis.x.tickWidth
      color: @_CONF.axis.x.color
      strokeWidth: @_CONF.axis.x.strokeWidth
      format: @_CONF.axis.x.format
      fontSize: @_CONF.axis.x.font.size
      fontColor: @_CONF.axis.x.font.color
      fontWeight: @_CONF.axis.x.font.weight
    }
    @_CLASS.gridX.render(params)

  renderYGrid: ->
    padding = @_CONF.canvas.padding
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    label = @_CONF.canvas.label.y
    switch @_CONF.axis.y.orient
      when 'left'
        label.trans =
          "rotate(-90) translate(#{-height/2}, #{padding[0]+10})"
      when 'right'
        trans = "translate(#{width-padding[0]}, 0)"
        label.textAnchor = "middle"
      else
        throw new Error("Unknown orientation: ", @_CONF.axis.y.orient)

    tickSize = @_CONF.axis.y.tickSize
    tickSize = -width+padding[0]*2 if tickSize == 'full'

    params = {
      class: "y"
      height: @_CONF.canvas.height
      width: @_CONF.canvas.width
      scale: @_SCALE.y
      ticks: @_CONF.axis.y.ticks
      tickSize: tickSize
      padding: padding
      label: label
      orient: @_CONF.axis.y.orient
      trans: trans
      tickColor: @_CONF.axis.y.tickColor
      tickWidth: @_CONF.axis.y.tickWidth
      color: @_CONF.axis.y.color
      strokeWidth: @_CONF.axis.y.strokeWidth
      format: @_CONF.axis.y.format
      fontSize: @_CONF.axis.y.font.size
      fontColor: @_CONF.axis.y.font.color
      fontWeight: @_CONF.axis.y.font.weight
    }
    @_CLASS.gridY.render(params)

  renderPoints: ->
    _scope  = @
    _conf   = @_CONF
    _canvas = @_CANVAS
    _tooltipNode = @_CLASS.tooltip.getDOM().root
    _tooltipShow = @_CLASS.tooltip.show
    _tooltipHide = @_CLASS.tooltip.hide
    _tooltipCallback = _conf.tooltip.callback
    _tooltipTemplate = _conf.tooltip.template

    if typeof(_tooltipCallback) == "string"
      _tooltipCallback = @_CLASS.tooltip.getCallback(_tooltipCallback)
    if typeof(_tooltipTemplate) == "string"
      _tooltipTemplate = @_CLASS.tooltip.getTemplate(_tooltipTemplate)

    scaleW = @_SCALE.x
    scaleH = @_SCALE.y

    series = @_CANVAS.selectAll(".series")
      .data(@_SERIES).enter()
        .append("g")
        .attr("class", "series")
        .attr("id", (s, i)->"#{i}")
        .attr("title", (s)->s.name)

    if _conf.canvas.render == 'line' or _conf.canvas.render == 'dotline'
      valueline = d3.svg.line()
        .interpolate("linear")
        .x((d)->scaleW(d.x))
        .y((d)->scaleH(d.y))

      series.append("path")
        .attr("class", "line")
        .attr("d", (d)->valueline(d.data))
        .attr('stroke', ((d, serieIndex)->
          d.data[0].config.color #Take the first color
        ))
        .attr("fill", "none")
        .attr("stroke-width", _conf.line.stroke.width)

    if _conf.canvas.render == 'dot' or _conf.canvas.render == 'dotline'
      series.selectAll(".circle")
        .data((d) -> d.data)
        .enter().append("circle")
          .attr('cx', (d) -> scaleW(d.x))
          .attr('cy', (d) -> scaleH(d.y))
          .attr('data-x', (d) -> d.x)
          .attr('data-y', (d) -> d.y)
          .attr('data-color', (d) -> d.config.color)
          .attr('r', ( (d) ->
            d.config.r))
          .attr('stroke',( (d) ->
            if _conf.point.mode == 'empty'
              d.config.color
            else if _conf.point.mode == 'fill'
              _conf.canvas.bgcolor
            else
              throw new Error("Unknown point mode '#{_conf.point.mode}'")
          ))
          .attr('fill', ((d)->
            if _conf.point.mode == 'empty'
              _conf.canvas.bgcolor
            else if _conf.point.mode == 'fill'
              d.config.color
            else
              throw new Error("Unknown point mode '#{_conf.point.mode}'")
          ))
          .attr('stroke-width', ( (d) ->
            d.config?.stroke?.width ? _conf.point.stroke.width))
          .on('mouseover', (d)->
            effect = _conf.point.onMouseover
            if typeof effect == 'string'
              effect = M.effectsPoint[effect].onMouseover
            effect(
              canvas: _canvas
              circleNode: this
              data: d
            )

            # Data for the tooltip callback
            data = _tooltipCallback(
              format: _conf.tooltip.format
              canvas: _canvas
              tooltipNode: _tooltipNode
              circleNode: this
              data: d
            )
            _tooltipNode.html(_tooltipTemplate(data))
            _tooltipShow(this,
              {
                canvas:
                  width: _conf.canvas.width
                  height: _conf.canvas.height
                tooltip:
                  alwaysInside: _conf.tooltip.alwaysInside
              }, _tooltipNode, d)
          )
          .on('mouseout', (d) ->
            effect = _conf.point.onMouseout
            if typeof effect == 'string'
              effect = M.effectsPoint[effect].onMouseout
            effect(
              canvas: _canvas
              circleNode: this
              data: d
            )
            _tooltipHide(_tooltipNode)
          )
    else
      throw new Error("Unknown render value '#{_canvas.render}'")


  render: ->
    @_CANVAS = @createSVG() if not @_CANVAS?

    @_CLASS.logo.render(
      canvas: @_CONF.canvas # TODO: confCanvas
      logo:   @_CONF.logo
    )

    @renderXGrid()
    @renderYGrid()

    @_CLASS.axisX.render(
      confAxis:   @_CONF.axis.x
      confCanvas: @_CONF.canvas
    )

    @_CLASS.axisY.render(
      confAxis:   @_CONF.axis.y
      confCanvas: @_CONF.canvas
    )

    @renderPoints() # Depends on axis and tooltip

    # TODO: only pass confCanvas: @_CONF.canvas
    @_CLASS.title.render(
      title:    @_CONF.canvas.title
      padding:  @_CONF.canvas.padding
    )

    @_CLASS.legend.render(
      svg:      @_CANVAS        # TODO: constructor ?
      canvas:   @_CONF.canvas   # TODO: confCanvas
      series:   @_SERIES        # TODO: constructor ?
      legends:  @_CONF.legends  # TODO: confLegends
    ) if @_CONF.legends.show

    @_CLASS.cross.render(
      svg:        @_CANVAS  # TODO: constructor
      confCanvas: @_CONF.canvas
      confCross:  @_CONF.canvas.cross
    )

    @_CLASS.cross.renderValue(
      scale:      @_SCALE   # TODO: in constructor ?
      canvas:     @_CANVAS  # TODO: in constructor ?
      confCanvas: @_CONF.canvas
      confCrossV: @_CONF.canvas.crossValue
    )

    @_CLASS.plugin.render(
      context: @
      canvas: @_CONF.canvas # TODO: confCanvas
      iconsFolder: @_CONF.pluginsIconsFolder
      confPlugins: @_CONF.plugins
    )

