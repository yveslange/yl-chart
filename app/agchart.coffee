palette = require 'utils/palette'

module.exports = exp = {}

exp.Main = class Main
  constructor: (args) ->
    @_CONF =
      tooltip:
        format:
          x: null
          y: null
        callback: "singlePoint"
        alwaysInside: true
      canvas:
        bgcolor: "#FFFFFF"
        render: "dot" # dot, line
        title:
          text: "AgChart"
          color: "#afafaf"
        label:
          x:
            text: null
            size: 10
            color: "#7f7f7f"
          y:
            text: null
            size: 10
            color: "#7f7f7f"
        selector: undefined
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
      logo:
        url: "agflow-logo.svg"
        width: 100
        height: 50
        x: 'right'
        y: 'bottom'
        opacity: 0.5
      point:
        onMouseover: "singlePoint"
        onMouseout: "singlePoint"
        r: 4
        color: "munin"
        stroke:
          width: 4
          color: null
      axis:
        x:
          format: null
          tickSize: undefined
          orient: "bottom"
          tickColor: "#efefef"
          tickWidth: 2
          strokeWidth: 1
          color: "#2f2f2f"
        y:
          format: null
          tickSize: undefined
          orient: "left"
          tickColor: "#efefef"
          tickWidth: 2
          strokeWidth: 1
          color: "#2f2f2f"
    @_SERIES = @prepareSeries args.series
    @_CANVAS = undefined
    @_TOOLTIP = undefined
    @_SCALE =
      x: undefined
      y: undefined

    @defaultConfig args.config
    @computePadding()
    @computeScales()
    return


  # Define custom value for the configuration
  defaultConfig: (c={}) ->
    # Check if the obj is a node.
    isNode = (obj) ->
      if obj?["0"]?.nodeName?
        return true
      return false

    setConf = (conf,obj) ->
      if obj?
        for k of obj
          if isNode(obj[k])
            conf[k] = obj[k][0] ? conf[k][0] # If node, we just copy it
          else if typeof obj[k] == 'object'
            setConf conf[k], obj[k]
          else
            conf[k] = obj[k] ? conf[k]
    setConf(@_CONF,c)
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
    @_CANVAS = d3.select(@_CONF.canvas.selector)
      .append('svg')
      .attr("fill", @_CONF.canvas.bgcolor)
      .attr('width', @_CONF.canvas.width)
      .attr('height', @_CONF.canvas.height)

  renderTitle: (params={
    title: ""
    color: null
  }) ->
    @_CANVAS.append("text")
      .attr("class", "title")
      .attr("fill", params.color)
      .text(params.title)

  renderLabel: (params={
    label:
      color: null
      size: null
      trans: null
      text: ""
    class: null }) ->
    @_CANVAS.append("text")
      .attr("fill", params.label.color)
      .attr("class", "label #{params.class}")
      .attr("font-size", params.label.size+"px")
      .attr("text-anchor", "middle")
      .attr("transform", params.label.trans)
      .text(params.label.text)

  renderAxis: (params={
    class: null
    scale:  null
    height: null
    width:  null
    padding:null
    orient: null
    trans:  null
    label:  null
    format: null }) ->

    axis = d3.svg.axis()
      .scale(params.scale)
      .orient(params.orient)
      .tickSize(params.tickSize)

    if params.format?
      axis.ticks(d3.time.months, 1)
      axis.tickFormat(
        d3.time.format(params.format)
      )

    gaxis = @_CANVAS
      .append("g")
      .attr("transform", params.trans)
      .attr("class", "axis #{params.class}")
      .call(axis)

    @renderLabel(params)

    gaxis.selectAll("line")
      .attr("stroke", params.color)
      .attr("stroke-width", params.strokeWidth)

    # Selecting the ticks only without the first one
    gaxis.selectAll("line").filter((d) -> return d)
      .attr("stroke", params.tickColor)
      .attr("width-stroke", params.tickWidth)

    # Trick to hide the path around the graph
    gaxis.selectAll("path")
      .style("display", "none")

    # Color of the text on axis
    gaxis.selectAll("text")
      .attr("fill", params.label.color)
      .attr("font-size", params.label.size)

  renderXAxis: ->
    padding = @_CONF.canvas.padding[1]
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    trans = "translate(0, #{padding})"
    label = @_CONF.canvas.label.x
    label.trans =
      "translate(#{width/2}, #{height-1})"
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
    axis = @renderAxis(params)

  renderYAxis: ->
    padding = @_CONF.canvas.padding[0]
    height = @_CONF.canvas.height
    width = @_CONF.canvas.width
    trans = "translate(#{padding}, 0)"
    label = @_CONF.canvas.label.y
    label.trans =
      "rotate(-90) translate(#{-height/2}, #{padding+10})"

    tickSize = @_CONF.axis.y.tickSize
    tickSize = -width+padding*2 if tickSize == 'full'

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
    axis = @renderAxis(params)


  prepareSeries: (data) ->
    # Adding the configuration to each points
    # TODO: adding the configuration to each point might not be the
    # better solution
    for serie, i in data
      for point in serie.data
        point.x = point.x
        if serie.config?
          point.config = serie.config
        else
          point.config = @_CONF.point
        point.serie = i
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
    _palette = new palette.Main(@_CONF.point.color)

    if typeof(_tooltipCallback) == "string"
      _tooltipCallback = @tooltip.callbacks[_tooltipCallback]
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
        .attr('stroke-width', ( (d) ->
          d.config?.stroke?.width ? _conf.point.stroke.width))
        .attr('stroke', ((d, serieIndex)->
          if d.config?.color?
            return d.config?.color
          if _palette.isDefined()
            return _palette.color(serieIndex)
          _conf.point.color
        ))
        .attr("fill", "none")

    if _conf.canvas.render == 'dot' or _conf.canvas.render == 'dotline'
      series.selectAll(".circle")
        .data((d) -> d.data)
        .enter().append("circle")
          .attr('cx', (d) -> scaleW(d.x))
          .attr('cy', (d) -> scaleH(d.y))
          .attr('data-x', (d) -> d.x)
          .attr('data-y', (d) -> d.y)
          .attr('r', ( (d) ->
            d.config?.r ?  _conf.point.r))
          .attr('stroke',( (d) ->
            if d.config?.stroke?.color?
              return d.config.stroke.color
            if _palette.isDefined()
              return _palette.color(d.serie)
            else
              _conf.point.stroke.color
          ))
          .attr('stroke-width', ( (d) ->
            d.config?.stroke?.width ? _conf.point.stroke.width))
          .attr('fill', ((d)->
            if d.config?.color?
              return d.config?.color
            if _palette.isDefined()
              return _palette.color(d.serie)
            _conf.point.color
          ))
          .on('mouseover', (d)->
            effect = _conf.point.onMouseover
            if typeof effect == 'string'
              effect = _effects[effect].onMouseover
            effect(
              canvas: _canvas
              circleNode: this
              data: d
            )

            _tooltipNode.html( _tooltipCallback(
              format: _conf.tooltip.format
              canvas: _canvas
              tooltipNode: _tooltipNode
              circleNode: this
              data: d
            ))

            conf =
              canvas:
                width: _conf.canvas.width
                height: _conf.canvas.height
              tooltip:
                alwaysInside: _conf.tooltip.alwaysInside
            _tooltipShow(this, conf, _tooltipNode, d)
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

  renderCross: (options)->
    padX = options.padding[0]
    padY = options.padding[1]
    offsetX = @_CONF.canvas.cross.x.offset
    offsetY = @_CONF.canvas.cross.y.offset
    _crossX = options.canvas.append("line")
      .attr("class", "crossX")
      .attr("x1", -options.width).attr("y1", padY)
      .attr("x2", -options.width).attr("y2", options.height-padY)
      .attr("stroke", options.cross.x.color)
      .attr("stroke-width", options.cross.x.stroke)
    _crossY = options.canvas.append("line")
      .attr("class", "crossY")
      .attr("x1", padX).attr("y1", -options.height)
      .attr("x2", options.width-padX).attr("y2", -options.height)
      .attr("stroke", options.cross.y.color)
      .attr("stroke-width", options.cross.y.stroke)
    options.canvas.on("mousemove", (d)->
      eventX = d3.mouse(@)[0]
      eventY = d3.mouse(@)[1]
      if options.cross.x.show and
      eventX >= padX+offsetX and
      eventX <= options.width-padX+offsetX
        _crossX
          .attr("x1", eventX-offsetX)
          .attr("x2", eventX-offsetX)
      if options.cross.y.show and
      eventY >= padY+offsetY and
      eventY <= options.height-padY+offsetY
        _crossY
          .attr("y1", eventY-offsetY)
          .attr("y2", eventY-offsetY)
    )

  renderLogo: (params) ->
    if params.y == 'bottom'
      params.y = @_CONF.canvas.height-@_CONF.canvas.padding[0]-params.height
    params.y = @_CONF.canvas.padding[0] if params.y == 'top'
    if params.x == 'right'
      params.x = @_CONF.canvas.width-@_CONF.canvas.padding[1]-params.width
    params.x = @_CONF.canvas.padding[1] if params.y == 'left'

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
    @renderTitle(
      title: @_CONF.canvas.title.text
      color: @_CONF.canvas.title.color
    )
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
      cross: @_CONF.canvas.cross
      padding: @_CONF.canvas.padding
      height: @_CONF.canvas.height
      width: @_CONF.canvas.width
    )
    @renderXAxis()
    @renderYAxis()
    @renderTooltip()
    @renderPoints() # Depends on axis and tooltip

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

    callbacks:
      singlePoint:
        (params) ->
          serieName = params.circleNode.parentNode.getAttribute("title")
          swatchColor = params.circleNode.getAttribute("fill")
          params.data.x = params.format.x(x) if params.format?.x?
          "<div>#{serieName}"+
            "<div class='swatch'
              style='background-color: #{swatchColor}'></div>"+
          "</div>"+
          "<div>#{params.data.x} #{params.data.y.toFixed(2)}</div>"
      multipleVertical:
        (params) ->
          # Get all same cx value, take the fill color to
          # draw watch and show some information
          _circleNode = params.circleNode
          cx = _circleNode.getAttribute('cx')
          x = parseFloat(_circleNode.getAttribute('data-x'))
          x = params.format.x(x) if params.format?.x?
          html = "#{x}"
          $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
            serieName = node.parentNode.getAttribute("title")
            swatchColor = node.getAttribute("fill")
            y = parseFloat(node.getAttribute("data-y")).toFixed(2)
            html += "<div>#{serieName} : #{y}"+
              "<div class='swatch'
                style='background-color: #{swatchColor}'></div>"+
            "</div>"
          )
          html
      multipleVerticalInverted:
        (params) ->
          # Get all same cx value, take the stroke color to
          # draw watch and show some information
          _circleNode = params.circleNode
          cx = _circleNode.getAttribute('cx')
          x = parseFloat(_circleNode.getAttribute('data-x'))
          x = params.format.x(x) if params.format?.x?
          html = "#{x}"
          $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
            serieName = node.parentNode.getAttribute("title")
            swatchColor = node.getAttribute("fill")
            y = parseFloat(node.getAttribute("data-y")).toFixed(2)
            html += "<div>#{serieName} : #{y}"+
              "<div class='swatch'
                style='background-color: #{swatchColor}'></div>"+
            "</div>"
          )
          html
