module.exports = exp = {}
M = {
  tools: require 'agchart/utils/tools'
}

exp.Main = class Main
  constructor: (userConfig) -> M.tools.updateObject(@defaultConfig,userConfig)

  # Get the configuration object
  get: () -> @defaultConfig

  # Default configuration for agchart
  defaultConfig:
    tooltip:
      template: "singlePoint"
      format:
        title: null
        serie: null
        x: null
        y: null
      callback: "singlePoint"
      alwaysInside: true
    canvas:
      scale:
        x:
          nice: false
          padding: [10, 10] # NOT WORKING YET
        y:
          nice: true
          padding: [10, 10] # NOT WORKING YET
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
          textAnchor: "middle"
          size: 10
          color: "#7f7f7f"
          offset: 15
          orient: "bottom"
          className: "x"
        y:
          text: null
          textAnchor: "middle"
          size: 10
          color: "#7f7f7f"
          offset: 0
          orient: "right"
          className: "y"
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
      fadeOnMouseover: true
      r: 4
      mode: 'empty' # empty, fill
      color: "munin"
      stroke:
        width: 1
    axis:
      x:
        format: null
        domainMargin: 5
        ticks: "auto"
        tickSize: null
        orient: "bottom" # bottom, top
        tickColor: "#f5f5f5"
        tickWidth: 2
        strokeWidth: 1
        color: "#2b2e33" # THe color of the y axis
        className: "x"
        font:
          color: "#2b2e33"
          size: 10
          weight: "normal"
      y:
        format: null
        domainMargin: 5
        ticks: "auto"
        tickSize: null
        orient: "left" # left, right
        tickColor: "#f5f5f5"
        tickWidth: 2
        strokeWidth: 1
        color: "#2b2e33" # The color of the x axis
        className: "y"
        font:
          color: "#2b2e33"
          size: 10
          weight: "normal"
    legends:
      show: true
      format: null
      toggleAll:
        show: true
        color: "#5f5f5f"
        text: ["Hide all", "Show all"]
      text:
        width: 50
      rect:
        width: 10
        height: 10
      margin: 5
      padding: [0, 15] # If you don't display some values !

    pluginsIconsFolder: "icons"
    plugins:
      exportation:
        displayName: "Exports the chart to a PNG file"
        enable: true
        copyright:
          text: "(c) AgFlow 2014"
          color: "#9f9f9f"
          fontSize: 12
