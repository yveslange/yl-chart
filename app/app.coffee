module.exports = exp = {}
M = {
  # Init
  config  : require 'ylchart/config'
  tools   : require 'ylchart/utils/tools'
  scale   : require 'ylchart/utils/scale'
  domain  : require 'ylchart/utils/domain'
  palette : require 'ylchart/utils/palette'
  design  : require 'ylchart/utils/design'
  effectsPoint : require 'ylchart/effects/point'

  # Components
  title:    require 'ylchart/components/title'
  tooltip:  require 'ylchart/components/tooltip'
  logo:     require 'ylchart/components/logo'
  legend:   require 'ylchart/components/legend'
  cross:    require 'ylchart/components/cross'
  axis:     require 'ylchart/components/axis'
  grid:     require 'ylchart/components/grid'
  label:    require 'ylchart/components/label'

  # Plugins
  plugin:   require 'ylchart/components/plugin'
}

exp.Main = class Main
  constructor: (args) ->
    # Loading default configuration merged with user
    # configuration
    @_CONF = new M.config.Main(args.config).get()
    @_PALETTE = new M.palette.Main(@_CONF.point.color)
    @_SVG = undefined

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
      confDomain: @_CONF.domain
    })

    @_SCALE = M.scale.computeScales({
      confCanvas: @_CONF.canvas
      confAxis: @_CONF.axis
      confGrid: @_CONF.grid
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
    if !document.querySelector(confCanvas.selector)
      throw new Error("Element '#{confCanvas.selector}' doesn't exists")
    $(confCanvas.selector).css({"position": "relative"})
    @_SVG = d3.select(confCanvas.selector)
      .append('svg')
      .attr("fill", confCanvas.bgcolor)
      .attr('width', confCanvas.width)
      .attr('height', confCanvas.height)
    @_CLASS.tooltip = new M.tooltip.Main(@_CONF.canvas.selector)
    @_CLASS.plugin  = new M.plugin.Main(@_CONF.canvas.selector)
    @_CLASS.logo    = new M.logo.Main(@_SVG)
    @_CLASS.gridX   = new M.grid.Main(@_SVG)
    @_CLASS.gridY   = new M.grid.Main(@_SVG)
    @_CLASS.labelX  = new M.label.Main(@_SVG)
    @_CLASS.labelY  = new M.label.Main(@_SVG)
    @_CLASS.axisX   = new M.axis.Main(@_SVG)
    @_CLASS.axisY   = new M.axis.Main(@_SVG)
    @_CLASS.cross   = new M.cross.Main(@_SVG)
    @_CLASS.legend  = new M.legend.Main(@_SVG)
    @_CLASS.title   = new M.title.Main(@_SVG)


  renderPoints: ->
    _scope  = @
    _conf   = @_CONF
    _canvas = @_SVG
    _tooltipNode = @_CLASS.tooltip.getDOM().root
    _tooltipShow = @_CLASS.tooltip.show
    _tooltipHide = @_CLASS.tooltip.hide
    _tooltipCallback = _conf.tooltip.callback
    _tooltipTemplate = _conf.tooltip.template
    _effectOver      = _conf.point.onMouseover
    _effectOut      = _conf.point.onMouseout || _effectOver

    if typeof _effectOver == 'string'
      _effectOver = M.effectsPoint[_effectOver].onMouseover
    if typeof _effectOut == 'string'
      _effectOut = M.effectsPoint[_effectOut].onMouseout
    if typeof(_tooltipCallback) == "string"
      _tooltipCallback = @_CLASS.tooltip.getCallback(_tooltipCallback)
    if typeof(_tooltipTemplate) == "string"
      _tooltipTemplate = @_CLASS.tooltip.getTemplate(_tooltipTemplate)

    scaleW = @_SCALE.x
    scaleH = @_SCALE.y

    series = @_SVG.selectAll(".series")
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
            _effectOver(
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

            # Hide all other series
            if _conf.point.fadeOnMouseover
              $(_canvas.node()).find(".series")
                .not("[data-hide='true']")
                .not("[id=#{d.serie}]").fadeTo(5, 0.15)
              $(@).show()
          )
          .on('mouseout', (d) ->
            _effectOut(
              canvas: _canvas
              circleNode: this
              data: d
            )
            _tooltipHide(_tooltipNode)

            # Show all series
            if _conf.point.fadeOnMouseover
              $(_canvas.node()).find(".series")
                .not("[id=#{d.serie}]")
                .not("[data-hide='true']").fadeTo(1, 1)
          )
    else
      throw new Error("Unknown render value '#{_canvas.render}'")


  render: ->
    @_SVG = @createSVG() if not @_SVG?

    @_CLASS.logo.render(
      confCanvas: @_CONF.canvas
      confLogo:   @_CONF.logo
      style:      @_CONF.style.logo
    )

    @_CLASS.gridX.render(
      scale:      @_SCALE.x
      confCanvas: @_CONF.canvas
      confGrid:   @_CONF.grid.x
      style:      @_CONF.style.grid.x
    )

    @_CLASS.gridY.render(
      scale:      @_SCALE.y
      confCanvas: @_CONF.canvas
      confGrid:   @_CONF.grid.y
      style:      @_CONF.style.grid.y
    )

    # WARNING: Should be after the grid to avoid overlapping
    @_CLASS.axisX.render(
      confAxis:   @_CONF.axis.x
      confCanvas: @_CONF.canvas
      style:      @_CONF.style.axis.x
    )

    @_CLASS.axisY.render(
      confAxis:   @_CONF.axis.y
      confCanvas: @_CONF.canvas
      style:      @_CONF.style.axis.y
    )

    @_CLASS.labelX.render(
      confCanvas: @_CONF.canvas
      confLabel:  @_CONF.canvas.label.x
      style: @_CONF.style.label.x
    )

    @_CLASS.labelY.render(
      confCanvas: @_CONF.canvas
      confLabel:  @_CONF.canvas.label.y
      style: @_CONF.style.label.y
    )

    @renderPoints() # Depends on axis and tooltip

    @_CLASS.title.render(
      confCanvas: @_CONF.canvas
      confTitle:  @_CONF.canvas.title
      style: @_CONF.style.title
    )

    @_CLASS.legend.render(
      svg:        @_SVG  # Needed to update the canvas
      confCanvas: @_CONF.canvas
      series:     @_SERIES
      confLegends:@_CONF.legends
    ) if @_CONF.legends.show

    @_CLASS.cross.render(
      svg:        @_SVG
      confCanvas: @_CONF.canvas
      confCross:  @_CONF.canvas.cross
      style: @_CONF.style.cross
    )

    @_CLASS.cross.renderValue(
      svg:        @_SVG
      scale:      @_SCALE
      confCanvas: @_CONF.canvas
      confCrossV: @_CONF.canvas.crossValue
      style:      @_CONF.style.crossValue.x
    )

    @_CLASS.plugin.render(
      context:      @
      confCanvas:   @_CONF.canvas
      iconsFolder:  @_CONF.pluginsIconsFolder
      confPlugins:  @_CONF.plugins
      style: @_CONF.style.plugins
    )
