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
        callback: "multipleVerticalInverted" # SinglePoint, multipleVertical
      point:
        # SinglePoint, multipleVertical, multipleVerticalInverted
        onMouseover: "multipleVerticalInverted"
        onMouseout: "multipleVerticalInverted"
        r: 3
        color: 'paired' # Color or palette name
        stroke: {width: 1, color: null}
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
          stroke: {width: 1, color: "#fff"}
      }
      {
        name: "Serie 2"
        data: genData(100, 5)
        config:
          #color: "#ff0001"
          stroke: {width: 1, "#fff"}
      }
      {
        name: "Serie 3"
        data: genData(100, 5)
        config:
          #color: "#00fffe"
          stroke: {width: 1, color: "#fff"}
      }
    ]
  )
  agChart.render()
