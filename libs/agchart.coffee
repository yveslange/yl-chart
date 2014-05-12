data = [4, 8, 15, 16, 23, 42]

class AgChart
  constructor: (args) ->
    @_CONF =
      canvas:
        render: 'circle'
        selector: null
        width: 300.0
        height: 200.0
        padding: [0,0]
      point:
        r: 4
        color: "#5e5e5e"
        stroke:
          color: "red"
          width: 4
    @defaultConfig args.config
    @_DATA = args.data
    @_CANVAS = null

    @computePadding()
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
    console.log "Datas:", @_DATA
    return

  computePadding: ->
    # What is the size of a point
    pad = @_CONF.point.r+@_CONF.point.stroke.width/2.0
    if @_CONF.canvas.padding == 'auto'
      @_CONF.canvas.padding = [pad,pad]

  createCanvas: ->
    throw "No selector defined" if not @_CONF.canvas.selector?
    @_CANVAS = d3.select(@_CONF.canvas.selector)
      .append('svg')
      .attr('width', @_CONF.canvas.width)
      .attr('height', @_CONF.canvas.height)

  renderPoints: ->
    _canvas = @_CONF.canvas
    maxX = d3.max(@_DATA, (a)->a[0])
    maxY = d3.max(@_DATA, (a)->a[1])
    funX = (d)->
      d[0]*(_canvas.width-_canvas.padding[0]*2)/
        maxX+_canvas.padding[0]
    funY = (d)->
      _canvas.height-(d[1]*(_canvas.height-_canvas.padding[1]*2)/
        maxY+_canvas.padding[1])

    if _canvas.render == 'dots'
      @_CANVAS.selectAll('circle')
        .data(@_DATA)
        .enter()
          .append('circle')
          .attr('cx', funX)
          .attr('cy', funY)
          .attr('r', @_CONF.point.r)
          .attr('stroke', @_CONF.point.stroke.color)
          .attr('stroke-width', @_CONF.point.stroke.width)
          .attr('fill', @_CONF.point.color)
    else
      throw "Unknown render value '#{_canvas.render}'"

  render: ->
    @_CANVAS = @createCanvas() if @_CANVAS == null
    @renderPoints()

#agChart = new AgChart(
#  data: [[0,2], [1,2.4], [2,1.9]]
#)
#agChart = new AgChart(
#  config: {}
#  data: [[0,2], [1,2.4], [2,1.9]]
#)
agChart = new AgChart(
  config:
    canvas:
      render: "dots"
      selector: '#chart1'
      padding: 'auto'
    point:
      color:
        stroke: "#44A0FF"
  data: [[0,0], [1,0], [20,14.2]]
)
agChart.render()
