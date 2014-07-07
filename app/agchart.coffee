module.exports = exp = {}
M = {
  config  : require 'config'
  palette : require 'utils/palette'
  tools   : require 'utils/tools'
  design  : require 'utils/design'
  effectsPoint : require 'effects/point'
  scale   : require 'utils/scale'
  domain  : require 'utils/domain'

  # Components
  title: require 'components/title'
  label: require 'components/label'
  tooltip: require 'components/tooltip'
}

exp.Main = class Main
  constructor: (args) ->
    # Loading default configuration merged with user
    # configuration
    @_CONF = new M.config.Main(args.config).get()
    @_PALETTE = new M.palette.Main(@_CONF.point.color)
    @_CANVAS = undefined # THIS IS A DOM, rename to SVG
    @_TOOLTIP = undefined # THIS IS A CLASS

    # Class components
    @_CLASS = {
      tooltip: undefined
      title: undefined
    }

    # TODO: Might be better ?
    #@_SETTINGS = {
    #  config: undefined
    #  scale: undefined
    #  palette: undefined
    #  domain: undefined
    #}

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
    @_CLASS.title = new M.title.Main(@_CANVAS)

  renderAxis: (params) ->
    line = @_CANVAS.append("line")
      .attr("stroke", params.axis.color)
      .attr("stroke-width", params.axis.strokeWidth)
    switch params.axis.orient
      when 'bottom'
        line
          .attr("x1", params.canvas.padding[0])
          .attr("y1", params.canvas.height-params.canvas.padding[1])
          .attr("x2", params.canvas.width-params.canvas.padding[0])
          .attr("y2", params.canvas.height-params.canvas.padding[1])
      when "top"
        line
          .attr("x1", params.canvas.padding[0])
          .attr("y1", params.canvas.padding[1])
          .attr("x2", params.canvas.width-params.canvas.padding[0])
          .attr("y2", params.canvas.padding[1])
      when "left"
        line
          .attr("x1", params.canvas.padding[0])
          .attr("y1", params.canvas.padding[1])
          .attr("x2", params.canvas.padding[0])
          .attr("y2", params.canvas.height-params.canvas.padding[1])
      when "right"
        line
          .attr("x1", params.canvas.width-params.canvas.padding[0])
          .attr("y1", params.canvas.padding[1])
          .attr("x2", params.canvas.width-params.canvas.padding[0])
          .attr("y2", params.canvas.height-params.canvas.padding[1])
      else
        throw new Error("Unknown orientation: ", params.axis.orient)

  renderGrid: (params={
    class: null
    color: null
    scale:  null
    height: null
    width:  null
    padding:null
    orient: null
    trans:  null
    label:  null
    format: null
  }) ->

    grid = d3.svg.axis()
      .scale(params.scale)
      .orient(params.orient)
      .tickSize(params.tickSize)

    if params.ticks != "auto"
      grid.ticks(params.ticks)

    if params.format?
      if params.ticks == "auto"
        grid.ticks(d3.time.months.utc, 1)
      else
        grid.ticks(d3.time.months.utc, params.ticks)
      grid.tickFormat(
        d3.time.format(params.format)
      )

    ggrid = @_CANVAS
      .append("g")
      .attr("transform", params.trans)
      .attr("class", "axis #{params.class}")
      .call(grid)

    # TODO: remove @renderLabel(params)
    @_CLASS.label = new M.label.Main(@_CANVAS)
    @_CLASS.label.render(params)

    ggrid.selectAll("line")
      .attr("stroke", params.color)
      .attr("stroke-width", params.strokeWidth)

    # Selecting the ticks only without the first one
    ggrid.selectAll("line")
      .attr("stroke", params.tickColor)
      .attr("width-stroke", params.tickWidth)

    # Trick to hide the path around the graph
    ggrid.selectAll("path")
      .style("display", "none")

    # Color of the text on axis
    ggrid.selectAll("text")
      .attr("fill", params.fontColor)
      .attr("font-size", params.fontSize)
      .attr("font-weight", params.fontWeight)

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
    @renderGrid(params)

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
    @renderGrid(params)


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


  renderCrossValue: (params={
    scale: null
    canvas: null
    confCanvas: null
    confCrossV: null
  }) ->
    # We append the container at the begining
    gbox = params.canvas.append("g")
      .style("opacity", 0)
    box = gbox.append("rect")
    text = gbox.append("text")
      .text("AgChartPile")
      .attr("font-size", params.confCrossV.x.fontSize)
      .attr("text-anchor", "middle")
      .attr("fill", params.confCrossV.x.fontColor)
    textDim = text.node().getBBox()
    box
      .attr("fill", params.confCrossV.x.color)
      .attr("rx", params.confCrossV.x.radius)
      .attr("ry", params.confCrossV.x.radius)

    if params.confCrossV.x.show
      timeoutUnmoved = null
      params.canvas.on("mousemove.crossValue", ->
        gbox.transition().duration(300).style('opacity', 1)
        clearTimeout(timeoutUnmoved)
        eventX = d3.mouse(@)[0]

        # Blocking the X value
        if eventX < params.confCanvas.padding[0]
          eventX = params.confCanvas.padding[0]
        else if eventX > params.confCanvas.width-params.confCanvas.padding[0]
          eventX = params.confCanvas.width-params.confCanvas.padding[0]

        # Blocking the position of the pile
        positionX = eventX
        if eventX < params.confCanvas.padding[0]+textDim.width/2
          positionX = params.confCanvas.padding[0]+textDim.width/2
        else if eventX > params.confCanvas.width-params.confCanvas.padding[0]-textDim.width/2
          positionX = params.confCanvas.width-params.confCanvas.padding[0]-textDim.width/2
        text
          .attr("y", textDim.height-textDim.height*0.25) # Seems that we need to remove 25%
                                                         # to have it centered. Auto magically
                                                         # resolved !
          .attr("x", textDim.width/2)
        box
          .attr("width", textDim.width)
          .attr("height", textDim.height)

        valueX = params.scale.x.invert(eventX)
        switch params.confCrossV.x.orient
          when 'top'
            eventY = params.confCanvas.padding[1]
          when 'bottom'
            eventY = params.confCanvas.height-params.confCanvas.padding[1]
        text.text(params.confCrossV.x.format(valueX))
        gbox.attr("transform", "translate(#{positionX-textDim.width/2}, #{eventY})")
        gbox.attr("cy", d3.mouse(@)[1])

        # Detect unmoved mouse
        timeoutUnmoved = setTimeout(( ->
          gbox.transition().duration(500).style('opacity', 0)
        ), 2000)
      )


  renderCross: (params={
    canvas: null
    confCanvas: null
    confCross: null
  })->
    padX = params.confCanvas.padding[0]
    padY = params.confCanvas.padding[1]
    offsetX = params.confCross.x.offset
    offsetY = params.confCross.y.offset
    width = params.confCanvas.width
    height = params.confCanvas.height
    _crossX = params.canvas.append("line")
      .attr("class", "crossX")
      .attr("x1", -width).attr("y1", padY)
      .attr("x2", -width).attr("y2", height-padY)
      .attr("stroke", params.confCross.x.color)
      .attr("stroke-width", params.confCross.x.stroke)
    _crossY = params.canvas.append("line")
      .attr("class", "crossY")
      .attr("x1", padX).attr("y1", -height)
      .attr("x2", width-padX).attr("y2", -height)
      .attr("stroke", params.confCross.y.color)
      .attr("stroke-width", params.confCross.y.stroke)
    timeoutUnmoved = null
    params.canvas.on("mousemove.tooltip", (d)->
      clearTimeout(timeoutUnmoved)
      _crossY.transition().style('opacity', 1)
      _crossX.transition().style('opacity', 1)
      eventX = d3.mouse(@)[0]
      eventY = d3.mouse(@)[1]
      if params.confCross.x.show and
      eventX >= padX+offsetX and
      eventX <= width-padX+offsetX
        _crossX
          .attr("x1", eventX-offsetX)
          .attr("x2", eventX-offsetX)
      if params.confCross.y.show and
      eventY >= padY+offsetY and
      eventY <= height-padY+offsetY
        _crossY
          .attr("y1", eventY-offsetY)
          .attr("y2", eventY-offsetY)
      # Detect unmoved mouse
      timeoutUnmoved = setTimeout(( ->
        _crossY.transition().duration(500).style('opacity', 0)
        _crossX.transition().duration(500).style('opacity', 0)
      ), 2000)
    )

  renderLogo: (params) ->
    if params.y == 'bottom'
      params.y = @_CONF.canvas.height-@_CONF.canvas.padding[1]-params.height
    params.y = @_CONF.canvas.padding[1] if params.y == 'top'
    if params.x == 'right'
      params.x = @_CONF.canvas.width-@_CONF.canvas.padding[0]-params.width
    params.x = @_CONF.canvas.padding[0] if params.y == 'left'

    @_CANVAS
      .append("image")
      .attr("width", params.width)
      .attr("height", params.height)
      .attr("x", params.x)
      .attr("y", params.y)
      .attr("opacity", params.opacity)
      .attr("id", "logo")
      .attr("xlink:href",@_CONF.logo.url)

  render: ->
    @_CANVAS = @createSVG() if not @_CANVAS?
    @renderLogo(
      opacity: @_CONF.logo.opacity
      url: @_CONF.logo.url
      width: @_CONF.logo.width
      height: @_CONF.logo.height
      x: @_CONF.logo.x
      y: @_CONF.logo.y
    )
    @renderCross(
      canvas: @_CANVAS
      confCanvas: @_CONF.canvas
      confCross: @_CONF.canvas.cross
    )
    @renderXGrid()
    @renderYGrid()
    @renderAxis(
      canvas: @_CONF.canvas
      axis: @_CONF.axis.x
    )
    @renderAxis(
      canvas: @_CONF.canvas
      axis: @_CONF.axis.y
    )
    @renderCrossValue(
      scale: @_SCALE
      canvas: @_CANVAS
      confCanvas: @_CONF.canvas
      confCrossV: @_CONF.canvas.crossValue
    )

    @renderPoints() # Depends on axis and tooltip

    @_CLASS.title.render(
      title: @_CONF.canvas.title
      padding: @_CONF.canvas.padding
    )

    @renderPluginMenu(
      iconsFolder: @_CONF.pluginsIconsFolder
      selector: @_CONF.canvas.selector
      confPlugins: @_CONF.plugins
    )

    if @_CONF.legends.show
      @renderLegends()


  renderLegends: ->
    _series = @_SERIES
    selector = @_CONF.canvas.selector
    rectWidth = 10
    rectHeight = 10
    textWidth = 50
    rectMargin = 5

    # Width space available
    widthSpace = @_CONF.canvas.width-@_CONF.canvas.padding[0]*2

    posX = @_CONF.canvas.padding[0]
    posY = @_CONF.canvas.height-12

    currentX = 0
    currentY = 15
    legPanel = @_CANVAS.append("g")
      .attr("transform", "translate(#{posX}, #{posY})")
    for i, serie of @_SERIES
      @_CANVAS.attr("height", @_CONF.canvas.height+currentY)
      i = parseInt(i)
      color = serie.data[0].config.color
      text = serie.name
      if @_CONF.legends.format?
        text = @_CONF.legends.format(text)
      legend = legPanel.append("g")
        .attr("transform", "translate(#{currentX}, #{currentY})")
        .style("cursor", "pointer")
        .attr("data-serieIndex", i)
        .attr("data-hide", "false")
      rect = legend.append("rect")
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", color)
        .attr("stroke", "#afafaf")
        .attr("stroke-width", "1")
        .attr("rx", 5)
        .attr("ry", 5)
      legend.append("text")
        .attr("x", rectMargin+rectWidth)
        .attr("y", rectHeight-1)
        .attr("fill", color)
        .attr("font-size", 10)
        .text(text)
      if currentX+rectWidth+textWidth+
      rectMargin > widthSpace-rectWidth-textWidth-rectMargin
        currentX = 0
        currentY += 15
        # Update canvas height
      else
        currentX += rectWidth+textWidth+rectMargin

      legend.on("click", ()  ->
        opacity = $(this).css("opacity")
        serie = this.getAttribute("data-serieIndex")
        hide = this.getAttribute("data-hide")
        if hide == "false"
          $(this).fadeTo(100, 0.3)
          $(selector).find(".series#"+serie)[0].setAttribute("data-hide", "true")
          this.setAttribute("data-hide", "true")
        else
          $(this).fadeTo(100, 1)
          $(selector).find(".series#"+serie)[0].setAttribute("data-hide", "false")
          this.setAttribute("data-hide", "false")
        $(selector).find(".series#"+serie).toggle()
      )

  renderPluginMenu: (params={
    selector: null
    iconsFolder: 'icons'
    confPlugins: {}
  }) ->
    pluginsMenu = $("<div/>", {
      id: "pluginsMenu"
    }).appendTo(params.selector)
    pluginsMenu.css({
      "position": "absolute"
      "left": @_CONF.canvas.width+1
      "top": "0px"
      "opacity": 0.1
    })
    pluginsMenu.on("mouseover.menuPlugin", ()->
      pluginsMenu.animate({opacity: 1}, 10))
    pluginsMenu.on("mouseout.menuPlugin", ()->
      pluginsMenu.animate({opacity: 0.1}, 10))

    for plugin of params.confPlugins
      if params.confPlugins[plugin].enable
        icon = $("<img/>",{
          src: "#{params.iconsFolder}/#{plugin}.png"
          width: "30px"
        }).appendTo(pluginsMenu)
        icon.css({cursor: "pointer"})
        callback = @plugins[plugin].onClick
        context = @
        icon.click(-> callback(context, params.selector, params.confPlugins[plugin]))


  plugins:
    exportation:
      onClick: (context, selector, conf) ->
        # Replace logo by copyright text
        image = $(selector).find("image#logo").remove()
        text = context._CANVAS.append("text")
          .attr("fill", conf.copyright.color)
          .attr("font-size", conf.copyright.fontSize+"px")
          .text(conf.copyright.text)
        width = context._CONF.canvas.width
        height = context._CONF.canvas.height
        textDim = text.node().getBBox()
        pX = width-context._CONF.canvas.padding[0]-10
        pY = height-context._CONF.canvas.padding[1]-3
        text.attr("text-anchor", "end")
        text.attr("transform", "translate(#{pX}, #{pY})")

        # Converting the SVG to a canvas
        svg = $(selector).find("svg")[0]
        svg_xml = (new XMLSerializer()).serializeToString(svg)
        canvas = document.createElement('canvas')
        $("body").after(canvas)
        canvg(canvas, svg_xml)
        $(canvas).remove()

        # Convert canvas to PNG
        img = canvas.toDataURL("image/png")

        # Internet explorer can't save data URI scheme
        ua = window.navigator.userAgent
        msie = ua.indexOf("MSIE ")
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
          console.log "Internet explorer detected"
          window.winIE = win = window.open()
          win.document.body.innerHTML = "<center><img src='"+img+"'>"+
            "</img><br>Please right click on the image and choose 'Save image as...'</center>"
          win.document.close()
          #setTimeout('window.winIE.document.execCommand("SaveAs")', 1000)
        else
          a = document.createElement('a')
          a.href = img
          a.download = "agflow.png"
          $("body").append(a)
          a.click()

        # Trick: we need to re-render the logo
        context.renderLogo(
          opacity: context._CONF.logo.opacity
          url: context._CONF.logo.url
          width:context._CONF.logo.width
          height: context._CONF.logo.height
          x: context._CONF.logo.x
          y: context._CONF.logo.y
        )
        text.remove()
