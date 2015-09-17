module.exports = exp = {}

M = {
  ylchart: require 'ylchart/app'
  time:    require 'ylchart/utils/time'
}

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
  t = new M.time.Main(
    lang: 'en'
  )

  series = []
#  series.push {
#    name: "Serie 1"
#    data: genDataFunc(24*3600*120, 36*3600, (d) -> Math.cos(d)*10)
#    config:
#      stroke: {width: 1}
#  }
  series.push {
    name: "Serie 3"
    data: genDataFunc(24*3600*120, 48*3600, Math.sin)
    config:
      #color: "#00fffe"
      stroke: {width: 1}
  }
  series.push {
    name: "Serie 3b"
    data: genDataFunc(24*3600*120, 48*3600, Math.sin)
    config:
      color: "#00fa0f"
      stroke: {width: 1}
  }

  # singlePoint, multipleVertical, multipleVerticalInverted
  tooltipMode = "multipleVertical"
  #tooltipMode = "singlePoint"

  ylchart = new M.ylchart.Main(
    config:
      style:
        label:
          x:
            "font-size": 25
        logo:
          "xlink:href": "your-logo.svg"
          height: 30
          width: 30
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
        template: tooltipMode
        callback: tooltipMode
      line:
        stroke: width: 1
      point:
        r:           4
        mode:        'fill'
        onMouseover: "multipleVerticalInverted"
        color:       'light' # Color or palette name
        stroke:      {width: 1, color: null}
      axis:
        y: orient: "right"
      pluginsIconsFolder: "icons"
    series: series
  )
  ylchart.render()

  series.push {
    name: "Serie 2"
    data: genDataFunc(24*3600*120, 36*3600*2, Math.tan)
    config:
      color: "#ff0001"
      stroke: {width: 1}
  }

  ylchart2 = new M.ylchart.Main(
    config:
      style:
        label:
          x:
            "font-size": 25
        logo:
          "xlink:href": "your-logo.svg"
          height: 30
          width: 30
      canvas:
        render: 'dotline' # dot, line, dotline
        width: 900.0
        height: 400.0
        selector: '#chart2'
        padding: [50,50]
        scale: x: nice: true
        label:
          x: text: "Months2"
          y: text: "Values2"
      logo:
        position:
          x: 'right'
          y: 'bottom'
        opacity: 0.1
      tooltip:
        template: tooltipMode
        callback: tooltipMode
      line:
        stroke: width: 1
      point:
        r:           4
        mode:        'fill'
        onMouseover: "multipleVerticalInverted"
        color:       'light' # Color or palette name
        stroke:      {width: 1, color: null}
      axis:
        y: orient: "right"
      pluginsIconsFolder: "icons"
    series: series
  )
  ylchart2.render()
