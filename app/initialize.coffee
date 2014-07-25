module.exports = exp = {}

agchart = require 'agchart/app'
time = require 'agchart/utils/time'

# Just for the purpose of the example
genData = (len, inter=1) ->
  els = []
  for i in [0..len-1] by inter
    els.push {x: i*1000, y: Math.random()*100}
  els

genDataFunc = (len, inter=1, func) ->
  els = []
  for i in [0..len-1] by inter
    els.push {x: i*1000, y: func(i)*10+50}
  els

exp.run = ->
  # TODO: finish this module if needed (later on)
  t = new time.Main(
    lang: 'en'
  )

  series = []
#  series.push {
#    name: "Serie 1"
#    data: genDataFunc(24*3600*120, 36*3600, (d) -> Math.cos(d)*10)
#    config:
#      stroke: {width: 1}
#  }
#  series.push {
#    name: "Serie 2"
#    data: genDataFunc(24*3600*120, 36*3600*2, Math.tan)
#    config:
#      color: "#ff0001"
#      stroke: {width: 1}
#  }
#  series.push {
#    name: "Serie 3"
#    data: genDataFunc(24*3600*120, 48*3600, Math.sin)
#    config:
#      #color: "#00fffe"
#      stroke: {width: 1}
#  }
#
  i = 10
  y = 10
  series.push {
    name: "Serie "+(i+3)
    data: [{x: i*1000, y: i*10}]
  }

  tooltipFormat = (d) ->
    date = new Date(d)
    formatDate = d3.time.format("%b '%y")
    formatDate(date)

  # singlePoint, multipleVertical, multipleVerticalInverted
  mode = "multipleVerticalInverted"
  #mode = "multipleVertical"
  #mode = "singlePoint"

  agChart = new agchart.Main(
    config:
      canvas:
        render: 'dotline' # dot, line, dotline
        width: 900.0
        height: 400.0
        selector: '#chart1'
        padding: [50,50]
        scale: x: nice: true
        label:
          x: text: "Months"
          y: text: "Values"
      logo:
        position:
          x: 'right'
          y: 'bottom'
        opacity: 0.1
      tooltip:
        template: mode
        callback: mode
        format: x: tooltipFormat
      line:
        stroke: width: 1
      point:
        onMouseover: mode
        onMouseout: mode
        mode: 'fill'
        r: 4
        color: 'agflow' # Color or palette name
        stroke: {width: 1, color: null}
      axis:
        y: orient: "right"
      pluginsIconsFolder: "icons"
    series: series
  )
  agChart.render()
