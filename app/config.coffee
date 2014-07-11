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
    style:
      axis:
        x:
          stroke: "#2b2e33"
          "stroke-width": 1
          class: "x"
        y:
          stroke: "#2b2e33"
          "stroke-width": 1
          class: "y"
      logo:
        id: "logo"
        "xlink:href": "agflow-logo.svg"
        width: 100
        height: 50
        opacity: 0.5
      grid:
        x:
          class: "x"
          tick:
            stroke: "#f5f5f5"
            "width-stroke": 2
          font:
            fill: "#2b2e33"
            "font-size": 10
            "font-weight": "normal"
        y:
          class: "y"
          tick:
            color: "#5f5f5f"
          font:
            fill: "#2b2e33"
            "font-size": 10
            "font-weight": "normal"

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
        fontFamily: "arial"
        position:
          x: 35
          y: 5
        texts: [
          {
            text: "TEST OF MAIN TITLE"
            color: "#2f2f2f"
            size: 15
            weight: "bold"
            interline: -5
          }
          {
            text: "TEST OF MAIN TITLE"
            color: "#2f2f2f"
            size: 15
            weight: "bold"
            interline: -6
          }
          {
            text: "TEST OF SUBTITLE"
            color: "#5f5f5f"
            size: 15
            weight: "normal"
          }]
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
      x: 'right'
      y: 'bottom'
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
      x: orient: "bottom"
      y: orient: "left"
    grid:
      x:
        format: null
        tick:
          mode: "auto"
          size: "auto"
          freq: "auto"
      y:
        format: null
        tick:
          mode: "auto"
          size: "auto"
          freq: "auto"
    legends:
      show: true
      format: null
      toggleAll:
        show: true
        color: "#5f5f5f"
        text: ["Hide all", "Show all"]
      text:
        size: 14
        width: 60
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
