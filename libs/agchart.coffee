data = [4, 8, 15, 16, 23, 42]

class AgChart
  constructor: (args) ->
    @_CONF =
      canvas:
        render: 'circle'
        selector: undefined
        width: 600.0
        height: 400.0
        padding: [0,0] #left/right, bottom/top
      point:
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
    throw "No selector defined" if not @_CONF.canvas.selector?
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
    _conf = @_CONF
    _canvas = _conf.canvas
    scaleW = @_SCALE.width
    scaleH = @_SCALE.height
    _tooltipCallback = _conf.tooltip
    _tooltip = @_TOOLTIP

    if _canvas.render == 'dots'
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
          .attr('r', ( (d) ->
            d.config?.r ?  _conf.point.r))
          .attr('stroke',( (d) ->
            d.config?.stroke?.color ? _conf.point.stroke.color))
          .attr('stroke-width', ( (d) ->
            d.config?.stroke?.width ? _conf.point.stroke.width))
          .attr('fill', ((d)->
            d.config?.color ? _conf.point.color))
          .on('mouseover', (d)->
            _tooltip.html( _tooltipCallback(this, d) )
            _tooltip.transition()
              .duration(200)
              .style("opacity", 0.9)
            _tooltip
              .style("left", d3.event.pageX+_conf.point.stroke.width
                +'px')
              .style("top", d3.event.pageY+'px')
            _tooltip
          )
          .on('mouseout', ->
            _tooltip.transition()
              .duration(500)
              .style("opacity", 0)
          )
    else
      throw "Unknown render value '#{_canvas.render}'"

  renderTooltip: ->
    if not @_TOOLTIP?
      @_TOOLTIP = d3.select("body").append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)

  render: ->
    @_CANVAS = @createCanvas() if not @_CANVAS?
    @renderXAxis()
    @renderYAxis()
    @renderTooltip()
    @renderPoints() # Depends on axis and tooltip

tooltip = (node, d) ->
  serieName = node.parentNode.getAttribute("title")
  "<div>#{serieName}"+
  "<div>#{d.x} #{d.y.toFixed(2)}</div>"

genData = (len, inter=1) ->
  els = []
  for i in [0..len-1] by inter
    els.push {x: i, y: Math.random()*100}
  els

agChart = new AgChart(
  config:
    canvas:
      render: "dots"
      selector: '#chart1'
      padding: [30,30]
    tooltip: tooltip
    point: # Default configuration
      r: 3
      color: "#efefef"
      stroke: {width: 3, color: "#44A0FF"}
    ticks: {ySize: "full", xSize: "full"}
  series: [
    {
      name: "Serie 1"
      data: genData(1000)
      config:
        r: 2
        color: "#1256ef"
        stroke: {width: 2, color: "#ff0000"}
    }
    {
      name: "Serie 2"
      data: genData(100)
      config:
        r: 4
        stroke: {width: 1}
    }
  ]
)
agChart.render()
window.agChart = agChart
