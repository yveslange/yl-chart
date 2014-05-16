data = [4, 8, 15, 16, 23, 42]

class AgChart
  constructor: (args) ->
    @_CONF =
      tooltip:
        callback: "single"
      canvas:
        render: 'circle'
        selector: undefined
        width: 600.0
        height: 400.0
        padding: [0,0] #left/right, bottom/top
        cross:
          x:
            show: false
            color: 'black'
            stroke: 1
          y:
            show: false
            color: 'black'
            stroke: 1
      point:
        mouseover: @defaultPointMouseover
        mouseout: @defaultPointMouseout
        r: 4
        color: "#5e5e5e"
        stroke:
          color: "red"
          width: 4
      ticks:
        xSize: undefined
        ySize: undefined
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
    setConf = (conf,obj) ->
      if obj?
        for k of obj
          if typeof obj[k] == 'object'
            setConf conf[k], obj[k]
          else
            conf[k] = obj[k] ? conf[k]
    setConf(@_CONF,c)
    return @_CONF

  # TODO: Rename this to stroke de/highlight ?
  # TODO: Put this into an effect object ?
  defaultPointMouseover: (point) ->
    curStrokeWidth = parseFloat( point.getAttribute("stroke-width") )
    point.setAttribute("stroke-width", curStrokeWidth*2)

  defaultPointMouseout: (point) ->
    curStrokeWidth = parseFloat( point.getAttribute("stroke-width") )
    point.setAttribute("stroke-width", curStrokeWidth/2)

  toString: ->
    console.log "Canvas in #{@_CONF.selector}"
    console.log "Config", @_CONF
    console.log "Datas:", @_SERIES
    return

  computePadding: ->
    # What is the size of a point
    pad = @_CONF.point.r+@_CONF.point.stroke.width/2.0
    if @_CONF.canvas.padding == 'auto'
      @_CONF.canvas.padding = [pad,pad]

  maxX: ->
    max = Number.MIN_VALUE
    for serie in @_SERIES
      for point in serie.data
        max = point.x if point.x > max
    return max

  maxY: ->
    max = Number.MIN_VALUE
    for serie in @_SERIES
      for point in serie.data
        max = point.y if point.y > max
    return max

  computeScales: ->
    _canvas = @_CONF.canvas
    _pad = _canvas.padding
    maxX = @maxX()
    maxY = @maxY()
    @_SCALE.width = d3.scale.linear()
      .domain([0,maxX])
      .range([_pad[0], _canvas.width-_pad[0]])
    @_SCALE.height = d3.scale.linear()
      .domain([0,maxY])
      .range([_canvas.height-_pad[1], _pad[1]])

  createCanvas: ->
    throw new Error("No selector defined") if not @_CONF.canvas.selector?
    @_CANVAS = d3.select(@_CONF.canvas.selector)
      .append('svg')
      .attr('width', @_CONF.canvas.width)
      .attr('height', @_CONF.canvas.height)

  renderXAxis: ->
    padding = @_CONF.canvas.padding[1]
    height = @_CONF.canvas.height
    axisX = d3.svg
      .axis()
      .scale(@_SCALE.width)
    if @_CONF.ticks.xSize == 'full'
      axisX.tickSize(height-padding*2)
    else if @_CONF.ticks.xSize
      @_CONF.ticks.axisX.tickSize(@_CONF.ticks.xSize)
    @_CANVAS.append("g")
      .attr("transform", "translate(0," + padding + ")")
      .attr("class", "axis x")
      .call(axisX)

  renderYAxis: ->
    padding = @_CONF.canvas.padding[0]
    width = @_CONF.canvas.width
    axisY = d3.svg.axis()
      .scale(@_SCALE.height)
      .orient("left")
    if @_CONF.ticks.ySize == 'full'
      axisY.tickSize(-width+padding*2)
    else if @_CONF.ticks.ySize
      @_CONF.ticks.axisY.tickSize(@_CONF.ticks.ySize)
    @_CANVAS.append("g")
      .attr("transform", "translate("+padding+", 0)")
      .attr("class", "axis y")
      .call(axisY)

  prepareSeries: (data) ->
    # Adding the configuration to each points
    for serie in data
      for point in serie.data
        point.config = serie.config if serie.config?
    data

  renderPoints: ->
    _scope  = @
    _conf   = @_CONF
    _canvas = @_CANVAS
    _tooltipShow = @tooltipShow
    _tooltipHide = @tooltipHide
    _tooltipNode = @_TOOLTIP
    _tooltipCallback = _conf.tooltip.callback
    if typeof(_tooltipCallback) == "string"
      _tooltipCallback = @tooltipCallbacks[_tooltipCallback]
    scaleW = @_SCALE.width
    scaleH = @_SCALE.height

    if _conf.canvas.render == 'dots'
      series = @_CANVAS.selectAll(".series")
        .data(@_SERIES).enter()
          .append("g")
          .attr("class", "series")
          .attr("id", (s, i)->"#{i}")
          .attr("title", (s)->s.name)

      series.selectAll(".circle")
        .data((d) -> d.data) # 's' for a single serie
        .enter().append("circle")
          .attr('cx', (d) -> scaleW(d.x))
          .attr('cy', (d) -> scaleH(d.y))
          .attr('data-x', (d) -> d.x)
          .attr('data-y', (d) -> d.y)
          .attr('r', ( (d) ->
            d.config?.r ?  _conf.point.r))
          .attr('stroke',( (d) ->
            d.config?.stroke?.color ? _conf.point.stroke.color))
          .attr('stroke-width', ( (d) ->
            d.config?.stroke?.width ? _conf.point.stroke.width))
          .attr('fill', ((d)->
            d.config?.color ? _conf.point.color))
          .on('mouseover', (d)->
            _conf.point.mouseover(
              canvas: _canvas
              circleNode: this
              data: d
            )

            _tooltipNode.html( _tooltipCallback(
              canvas: _canvas
              tooltipNode: _tooltipNode
              circleNode: this
              data: d
            ))

            _tooltipShow(_tooltipNode, d)
          )
          .on('mouseout', (d) ->
            _conf.point.mouseout(
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
      @_TOOLTIP = d3.select("body").append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)

  renderCross: (options)->
    padX = options.padding[0]
    padY = options.padding[1]
    offsetX = 10 # To be centered on mouse
    offsetY = 10 # To be centered on mouse
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
      if options.cross.x.show and
      d3.event.pageX >= padX+offsetX and
      d3.event.pageX <= options.width-padX+offsetX
        _crossX
          .attr("x1", d3.event.pageX-offsetX)
          .attr("x2", d3.event.pageX-offsetX)
      if options.cross.y.show and
      d3.event.pageY >= padY+offsetY and
      d3.event.pageY <= options.height-padY+offsetY
        _crossY
          .attr("y1", d3.event.pageY-offsetY)
          .attr("y2", d3.event.pageY-offsetY)
    )

  render: ->
    @_CANVAS = @createCanvas() if not @_CANVAS?
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

  # TODO: create a tooltip object to handle this
  tooltipShow: (_tooltipNode, d) ->
    left = d3.event.pageX+d.config.stroke.width
    top = d3.event.pageY
    _tooltipNode.style("left", left+'px').style("top", top+'px')
      .transition().duration(200).style("opacity", 0.9)

  tooltipHide: (_tooltipNode) ->
    _tooltipNode.transition().duration(500).style("opacity", 0)

  tooltipCallbacks:
    single:
      (params) ->
        serieName = params.circleNode.parentNode.getAttribute("title")
        swatchColor = params.circleNode.getAttribute("stroke")
        "<div>#{serieName}"+
          "<div class='swatch'
            style='background-color: #{swatchColor}'></div>"+
        "</div>"+
        "<div>#{params.data.x} #{params.data.y.toFixed(2)}</div>"
    multipleVertical:
      (params) ->
        # Get all same cx value
        _circleNode = params.circleNode
        cx = _circleNode.getAttribute('cx')
        x = _circleNode.dataset.x
        html = "x=#{x}"
        $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
          serieName = node.parentNode.getAttribute("title")
          swatchColor = node.getAttribute("stroke")
          html += "<div>#{serieName} : #{params.data.y.toFixed(2)}"+
            "<div class='swatch'
              style='background-color: #{swatchColor}'></div>"+
          "</div>"
        )
        html

# Just for the purpose of the example
genData = (len, inter=1) ->
  els = []
  for i in [0..len-1] by inter
    els.push {x: i, y: Math.random()*100}
  els

onMouseOver = (params) ->
  _circleNode = params.circleNode
  cx = _circleNode.getAttribute('cx')
  strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))*4
  $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
    $(node).attr("stroke-width", strokeWidth)
  )

onMouseOut = (params) ->
  _circleNode = params.circleNode
  cx = _circleNode.getAttribute('cx')
  strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))/4
  $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
    $(node).attr("stroke-width", strokeWidth)
  )

agChart = new AgChart(
  config:
    canvas:
      render: "dots"
      selector: '#chart1'
      padding: [30,30]
      cross:
        x:
          show: true
          color: "#44A0FF"
        y:
          show: false
          color: "#FFA044"
    tooltip:
      callback: "multipleVertical" # Single, multipleVertical
    point: # Default configuration
      mouseover: onMouseOver
      mouseout: onMouseOut
      r: 3
      color: "#efefef"
      stroke: {width: 3, color: "#44A0FF"}
    ticks: {ySize: "full", xSize: "full"}
  series: [
    {
      name: "Serie 1"
      data: genData(1000)
      config:
        stroke: {color: "#A044FF", width: 1}
    }
    {
      name: "Serie 2"
      data: genData(100)
      config:
        stroke: {width: 1}
    }
  ]
)
agChart.render()
window.agChart = agChart
