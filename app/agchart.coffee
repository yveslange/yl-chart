palette = require 'utils/palette'

module.exports = exp = {}

exp.Main = class Main
  constructor: (args) ->
    @_CONF =
      tooltip:
        template: "singlePoint"
        format:
          x: null
          y: null
        callback: "singlePoint"
        alwaysInside: true
      canvas:
        bgcolor: "#FFFFFF"
        render: "dot" # dot, line
        title:
          text: ""
          color: "#2f2f2f"
          size: 24
          fontFamily: "arial"
          border:
            radius: 2
            color: "#3f3f3f"
            padding: [8,1]
          position:
            x: 35
            y: 20
        label:
          x:
            text: null
            size: 10
            color: "#7f7f7f"
          y:
            text: null
            size: 10
            color: "#7f7f7f"
        selector: null
        width: 600.0
        height: 400.0
        padding: [0,0] #left/right, bottom/top
        cross:
          x:
            show: false
            color: 'black'
            stroke: 1
            offset: 0
          y:
            show: false
            color: 'black'
            stroke: 1
            offset: 0
        crossValue:
          x:
            orient: 'bottom' # Top not implemented
            show: true
            color: '#0971b7'
            fontColor: '#ffffff'
            fontSize: 12
            format: (d) ->
              da = d.toString().split(" ")[2]
              m = d.toString().split(" ")[1]
              y = d.toString().split(" ")[3].substring(2)
              "#{da} #{m} #{y}"
            radius: 5
          y:
            show: true
            color: 'white'
      logo:
        url: "agflow-logo.svg"
        width: 100
        height: 50
        x: 'right'
        y: 'bottom'
        opacity: 0.5
      line:
        stroke:
          width: 2
      point:
        onMouseover: "singlePoint"
        onMouseout: "singlePoint"
        r: 4
        mode: 'empty' # empty, fill
        color: "munin"
        stroke:
          width: 1
      axis:
        x:
          format: null
          tickSize: null
          orient: "bottom" # bottom, top
          tickColor: "#f5f5f5"
          tickWidth: 2
          strokeWidth: 1
          color: "#2b2e33" # THe color of the y axis
        y:
          format: null
          tickSize: null
          orient: "left" # left, right
          tickColor: "#f5f5f5"
          tickWidth: 2
          strokeWidth: 1
          color: "#2b2e33" # The color of the x axis
      plugins:
        exportation:
          enable: true
          copyright:
            text: "(c) AgFlow 2014"
            color: "#9f9f9f"
            fontSize: 12
    @_CANVAS = undefined
    @_TOOLTIP = undefined
    @_SCALE =
      x: undefined
      y: undefined

    @defaultConfig args.config
    @_SERIES = @prepareSeries args.series
    @computePadding()
    @computeScales()
    return

  # TODO: should be in utils lib
  # Update the obj1 with the obj2
  updateObject: (obj1, obj2, replace=true) ->
    # Check if the obj is a node.
    isNode = (obj) ->
      if obj?["0"]?.nodeName?
        return true
      return false

    update = (obj1,obj2, replace=true) ->
      if obj2?
        for k of obj2
          if isNode(obj2[k]) # We copy the node as it is
            obj1[k] = obj2[k][0] ? obj1[k][0]
          else if typeof obj2[k] == 'object'
            obj1[k] = {} if not obj1[k]?
            update obj1[k], obj2[k], replace
          else
            if replace
              obj1[k] = obj2[k] ? obj1[k]
            else
              obj1[k] = obj1[k] ? obj2[k]
      return obj1
    update(obj1, obj2, replace)

  # Define custom value for the configuration
  defaultConfig: (c={}) ->
    @updateObject(@_CONF,c)
    return @_CONF

  # Effects for the events
  effects:
    singlePoint:
      onMouseover: (params) ->
        _circleNode = params.circleNode
        curStrokeWidth =
          parseFloat( _circleNode.getAttribute("stroke-width") )
        _circleNode.setAttribute("stroke-width", curStrokeWidth*2)
      onMouseout: (params) ->
        _circleNode = params.circleNode
        curStrokeWidth =
          parseFloat( _circleNode.getAttribute("stroke-width") )
        _circleNode.setAttribute("stroke-width", curStrokeWidth/2)
    multipleVertical:
      onMouseover:  (params) ->
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))*2
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          $(node).attr("stroke-width", strokeWidth)
        )
      onMouseout: (params) ->
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))/2
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          $(node).attr("stroke-width", strokeWidth)
        )
    multipleVerticalInverted:
      onMouseover:  (params) ->
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))*2
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          $(node).attr("stroke-width", strokeWidth)
          fill = $(node).attr("fill")
          stroke = $(node).attr("stroke")
          $(node).attr("stroke", fill)
          $(node).attr("fill", stroke)
        )

      onMouseout: (params) ->
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))/2
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          $(node).attr("stroke-width", strokeWidth)
          fill = $(node).attr("fill")
          stroke = $(node).attr("stroke")
          $(node).attr("stroke", fill)
          $(node).attr("fill", stroke)
        )
  toString: ->
    console.log "Canvas in #{@_CONF.selector}"
    console.log "Config", @_CONF
    console.log "Datas:", @_SERIES
    return

  computePadding: ->
    pad = @_CONF.point.r+@_CONF.point.stroke.width/2.0
    if @_CONF.canvas.padding == 'auto'
      @_CONF.canvas.padding = [pad,pad]

  getDomain: ->
    maxX = maxY = Number.MIN_VALUE
    minX = minY = Number.MAX_VALUE
    for serie in @_SERIES
      for point in serie.data
        maxX = point.x if point.x > maxX
        minX = point.x if point.x < minX
        maxY = point.y if point.y > maxY
        minY = point.y if point.y < minY
    {minX: minX, maxX: maxX, minY: minY, maxY: maxY}

  computeScales: ->
    _canvas = @_CONF.canvas
    _pad = _canvas.padding
    _domain = @getDomain()
    @_SCALE.width = d3.scale.linear()
    if @_CONF.axis.x.format?
      @_SCALE.width = d3.time.scale()
    @_SCALE.width.domain([_domain.minX,_domain.maxX])
      .nice() # end with round number
      .range([_pad[0], _canvas.width-_pad[0]])
    @_SCALE.height = d3.scale.linear()
    if @_CONF.axis.y.format?
      @_SCALE.height = d3.time.scale()
    @_SCALE.height.domain([_domain.minY,_domain.maxY])
      .nice()
      .range([_canvas.height-_pad[1], _pad[1]])

  createCanvas: ->
    throw new Error("No selector defined") if not @_CONF.canvas.selector?
    $(@_CONF.canvas.selector).css({"position": "relative"})
    @_CANVAS = d3.select(@_CONF.canvas.selector)
      .append('svg')
      .attr("fill", @_CONF.canvas.bgcolor)
      .attr('width', @_CONF.canvas.width)
      .attr('height', @_CONF.canvas.height)

  renderTitle: (params={
    title: null
    padding: null
  }) ->
    posX = params.title.position.x
    posY = params.title.position.y
    gbox = @_CANVAS.append("g")
      .attr("transform", "translate(#{posX},#{posY})")
    rect = gbox.append("rect")
    text = gbox.append("text")
      .attr("class", "chart-title")
      .attr("fill", params.title.color)
      .attr("font-size", params.title.size)
      .attr("font-weight", "bold")
      .attr("font-family", params.title.fontFamily) #Important to fix the font !
      .text(params.title.text)
    textDim = text.node().getBBox()
    text
      .attr("x", params.title.border.padding[0])
      .attr("y", textDim.height-params.title.border.padding[1]-2)
    rect
      .attr("width", textDim.width+params.title.border.padding[0]*2)
      .attr("height", textDim.height+params.title.border.padding[1]*2)
      .attr("ry", params.title.border.radius)
      .attr("rx", params.title.border.radius)
      .attr("stroke", params.title.border.color)


  renderLabel: (params={
    label:
      color: null
      size: null
      trans: null
      text: ""
      textAnchor: ""
    class: null }) ->
    @_CANVAS.append("text")
      .attr("fill", params.label.color)
      .attr("class", "label #{params.class}")
      .attr("font-size", params.label.size+"px")
      .attr("text-anchor", params.label.textAnchor)
      .attr("transform", params.label.trans)
      .text(params.label.text)


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
    format: null }) ->

    grid = d3.svg.axis()
      .scale(params.scale)
      .orient(params.orient)
      .tickSize(params.tickSize)

    if params.format?
      grid.ticks(d3.time.months, 1)
      grid.tickFormat(
        d3.time.format(params.format)
      )

    ggrid = @_CANVAS
      .append("g")
      .attr("transform", params.trans)
      .attr("class", "axis #{params.class}")
      .call(grid)

    @renderLabel(params)

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
      .attr("fill", params.label.color)
      .attr("font-size", params.label.size)

  renderXGrid: ->
    padding = @_CONF.canvas.padding[1]
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    label = @_CONF.canvas.label.x
    label.textAnchor = "middle"
    switch @_CONF.axis.x.orient
      when 'bottom'
        trans = "translate(0, #{padding})"
        label.trans =
          "translate(#{width/2}, #{height-2})"
      when 'top'
        trans = "translate(0, #{height-padding})"
        label.trans =
          "translate(#{width/2}, #{padding/2})"
      else
        throw new Error("Unknown orientation: ", @_CONF.axis.x.orient)
    tickSize = @_CONF.axis.x.tickSize
    tickSize =  height-padding*2 if tickSize == 'full'
    params = {
      class: "x"
      height: @_CONF.canvas.height
      width: @_CONF.canvas.width/2
      scale: @_SCALE.width
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
    }
    @renderGrid(params)

  renderYGrid: ->
    padding = @_CONF.canvas.padding
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    label = @_CONF.canvas.label.y
    switch @_CONF.axis.y.orient
      when 'left'
        trans = "translate(#{padding[0]}, 0)"
        label.trans =
          "rotate(-90) translate(#{-height/2}, #{padding[0]+10})"
      when 'right'
        trans = "translate(#{width-padding[0]}, 0)"
        label.trans =
          "translate(#{width-padding[0]}, #{padding[1]/2})"
        label.textAnchor = "middle"
      else
        throw new Error("Unknown orientation: ", @_CONF.axis.y.orient)

    tickSize = @_CONF.axis.y.tickSize
    tickSize = -width+padding[0]*2 if tickSize == 'full'

    params = {
      class: "y"
      height: @_CONF.canvas.height
      width: @_CONF.canvas.width
      scale: @_SCALE.height
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
    }
    @renderGrid(params)


  prepareSeries: (data) ->
    # Adding the configuration to each points
    # TODO: adding the configuration to each point might not be the
    # better solution
    _palette = new palette.Main(@_CONF.point.color)
    for serie, i in data
      for point in serie.data
        point.serie = i

        # NOTE:
        # The configuration of the point should be automatic. But
        # the problem is that we need to clone the configuration
        # of the serie to each point
        point.config = {}
        point.config.color = @_CONF.point.color
        if _palette.isDefined()
          point.config.color = _palette.color(i)
        if serie.config?.color?
          point.config.color = serie.config.color
        point.config.r = serie.config?.r || @_CONF.point.r
        point.config.stroke = {
          width: @_CONF.point.stroke.width
        }
        if serie.config?.stroke?.width?
          point.config.stroke.width = serie.config.stroke.width
    data

  renderPoints: ->
    _scope  = @
    _conf   = @_CONF
    _canvas = @_CANVAS
    _effects = @effects
    _tooltipShow = @tooltip.show
    _tooltipHide = @tooltip.hide
    _tooltipNode = @_TOOLTIP
    _tooltipCallback = _conf.tooltip.callback
    _tooltipTemplate = _conf.tooltip.template

    if typeof(_tooltipCallback) == "string"
      _tooltipCallback = @tooltip.callbacks[_tooltipCallback]
    if typeof(_tooltipTemplate) == "string"
      _tooltipTemplate = @tooltip.templates[_tooltipTemplate]
    scaleW = @_SCALE.width
    scaleH = @_SCALE.height

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
              effect = _effects[effect].onMouseover
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
              effect = _effects[effect].onMouseout
            effect(
              canvas: _canvas
              circleNode: this
              data: d
            )
            _tooltipHide(_tooltipNode)
          )

    else
      throw new Error("Unknown render value '#{_canvas.render}'")

  renderTooltip: ->
    if not @_TOOLTIP?
      @_TOOLTIP = d3.select(@_CONF.canvas.selector).append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('left', 0)
        .attr('top', 0)

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
          .attr("y", textDim.height-textDim.height*0.25) # Seems that we need to remove 25% to have it centered. Auto magically resolved !
          .attr("x", textDim.width/2)
        box
          .attr("width", textDim.width)
          .attr("height", textDim.height)

        valueX = params.scale.width.invert(eventX)
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
    canvas: nulle
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
      .attr("xlink:href",@_CONF.logo.url)

  render: ->
    @_CANVAS = @createCanvas() if not @_CANVAS?
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
    @renderTooltip()
    @renderPoints() # Depends on axis and tooltip
    @renderTitle(
      title: @_CONF.canvas.title
      padding: @_CONF.canvas.padding
    )

    @renderPluginMenu(
      selector: @_CONF.canvas.selector
      confPlugins: @_CONF.plugins
    )

    @renderLegends()

  renderLegends: ->

    console.log "Render legends"
    rectWidth = 30
    rectHeight = 10
    textWidth = 100
    rectMargin = 2

    # Update the size of the SVG to display the legend

    # Width space available
    widthSpace = @_CONF.canvas.width-@_CONF.canvas.padding[0]*2

    posX = @_CONF.canvas.padding[0]
    posY = @_CONF.canvas.height-12

    currentX = 0
    currentY = 15
    legPanel = @_CANVAS.append("g")
      .attr("transform", "translate(#{posX}, #{posY})")
    for i, serie of @_SERIES
      i = parseInt(i)
      color = serie.data[0].config.color
      legend = legPanel.append("g")
        .attr("transform", "translate(#{currentX}, #{currentY})")
      legend.append("rect")
        .attr("width", rectWidth)
        .attr("height", 10)
        .attr("fill", color)
        .attr("stroke", "#afafaf")
        .attr("stroke-width", "1")
      legend.append("text")
        .attr("x", rectMargin+rectWidth)
        .attr("y", 10)
        .attr("fill", "#3f3f3f")
        .attr("font-size", 10)
        .text(serie.name)
      if currentX+rectWidth+textWidth+rectMargin> widthSpace-rectWidth-textWidth-rectMargin
        currentX = 0
        currentY += 15
        # Update canvas height
        @_CANVAS.attr("height", @_CONF.canvas.height+currentY)
      else
        currentX += rectWidth+textWidth+rectMargin



  renderPluginMenu: (params={
    selector: null
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
          src: "icons/#{plugin}.png"
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
        image = $(selector).find("image").remove()
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
        $("body").append(canvas)
        canvg(canvas, svg_xml)
        canvas.remove()

        # Convert canvas to PNG
        img = canvas.toDataURL("image/png")
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

  tooltip:
    show: (context, conf, tooltipNode, d) ->
      eventX = d3.mouse(context)[0]
      eventY = d3.mouse(context)[1]
      left = eventX+d.config.stroke.width
      top = eventY+d.config.stroke.width
      if conf.tooltip.alwaysInside
        if eventX > conf.canvas.width/2.0
          widthTooltip = parseFloat(
            tooltipNode.style('width').replace("px", ''))
          left = eventX-d.config.stroke.width-
            widthTooltip
        if eventY > conf.canvas.height/2.0
          heightTooltip = parseFloat(
            tooltipNode.style('height').replace("px", ''))
          top = eventY-d.config.stroke.width-
            heightTooltip
      tooltipNode
        .style("left", left+'px')
        .style("top", top+'px')
        .transition().duration(200).style("opacity", 0.9)

    hide: (tooltipNode) ->
      tooltipNode.transition()
        .duration(500).style("opacity", 0)

    templates:
      singlePoint: (data) ->
        "<div>#{data[0].serieName}"+
          "<div class='swatch'"+
            "style='background-color: #{data[0].color}'></div>"+
        "</div>"+
        "<div>#{data[0].x} #{data[0].y}</div>"
      multipleVertical: (data) ->
        html = ""
        for d in data
          html += "<div>#{d.serieName}"+
            "<div class='swatch'"+
              "style='background-color: #{d.color}'></div>"+
          "</div>"+
          "<div>#{d.x} #{d.y}</div>"
        html
      multipleVerticalInverted: (data) ->
        html = "#{data[0].x}"
        for d in data
          html += "<div>#{d.serieName}: #{d.y}"+
            "<div class='swatch'"+
              "style='background-color: #{d.color}'></div>"+
          "</div>"
        html

    callbacks:
      singlePoint:
        (params) ->
          _circleNode = params.circleNode
          x = parseFloat(_circleNode.getAttribute('data-x'))
          x = params.format.x(x) if params.format?.x?
          [{
            color: params.data.config.color
            serieName: params.circleNode.parentNode.getAttribute("title")
            x: x
            y: params.data.y.toFixed(2)
          }]
      multipleVertical:
        (params) ->
          # Get all same cx value, take the fill color to
          # draw watch and show some information
          _circleNode = params.circleNode
          cx = _circleNode.getAttribute('cx')
          x = parseFloat(_circleNode.getAttribute('data-x'))
          x = params.format.x(x) if params.format?.x?
          res = []
          $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
            res.push {
              serieName: node.parentNode.getAttribute("title")
              color: node.getAttribute("data-color")
              y: parseFloat(node.getAttribute("data-y")).toFixed(2)
              x: x
            })
          res

      multipleVerticalInverted:
        (params) ->
          # Get all same cx value, take the fill color to
          # draw watch and show some information
          _circleNode = params.circleNode
          cx = _circleNode.getAttribute('cx')
          x = parseFloat(_circleNode.getAttribute('data-x'))
          x = params.format.x(x) if params.format?.x?
          res = []
          $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
            res.push {
              serieName: node.parentNode.getAttribute("title")
              color: node.getAttribute("data-color")
              y: parseFloat(node.getAttribute("data-y")).toFixed(2)
              x: x
            })
          res
