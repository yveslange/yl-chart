agchart = require 'agchart'

module.exports = exp = {}

exp.run = ->
  # Just for the purpose of the example
  genData = (len, inter=1) ->
    els = []
    for i in [0..len-1] by inter
      els.push {x: i, y: Math.random()*100}
    els

  agChart = new agchart.Main(
    config:
      canvas:
        render: 'dots'
        label:
          x:
            text: "Some label X"
            size: 10
            color: "#7f7f7f"
          y:
            text: "some label Y"
            size: 10
            color: "#7f7f7f"
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
        onMouseover: "multipleVertical"
        onMouseout: "multipleVertical"
        r: 3
        color: "#efefef"
        stroke: {width: 3, color: "#44A0FF"}
      axis:
        y:
          tickSize: "full"
        x:
          tickSize: "full"
    series: [
      {
        name: "Serie 1"
        data: genData(100, 10)
        config:
          stroke: {color: "#A044FF", width: 1}
      }
      {
        name: "Serie 2"
        data: genData(100, 5)
        config:
          stroke: {width: 1}
      }
    ]
  )
  agChart.render()
