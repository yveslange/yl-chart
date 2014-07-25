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
      plugins:
        panel:
          position: "right"
          top: 0
          opacity: 0.1
      axis:
        x:
          stroke: "#2b2e33"
          class: "x"
          "stroke-width": 1
        y:
          stroke: "#2b2e33"
          class: "y"
          "stroke-width": 1
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
          text:
            fill: "#2b2e33"
            "font-size": 10
            "font-weight": "normal"
        y:
          class: "y"
          tick:
            stroke: "#f5f5f5"
          text:
            fill: "#2b2e33"
            "font-size": 10
            "font-weight": "normal"
      label:
        x:
          "text-anchor": "middle"
          class: "label x"
          fill: "#5f5f5f"
          "font-size": 14
          "font-weight": "bold"
        y:
          "text-anchor": "middle"
          "font-size": 14
          fill: "#5f5f5f"
          class: "label y"
          "font-weight": "bold"
      title: [
        {fill: "#2f2f2f", "font-size": 15, "font-weight": "bold"}
        {fill: "#2f2f2f", "font-size": 15, "font-weight": "bold"}
        {fill: "#2f2f2f", "font-size": 12}
      ]
      cross:
        x:
          class: "crossX"
          stroke: "#44A0FF"
          "stroke-width": 1
        y:
          class: "crossY"
          stroke: "#FFA044"
          "stroke-width": 1
      crossValue:
        x:
          text:
            "font-size": 12
            "text-anchor": "middle"
            fill: "#FFFFFF"
          background:
            fill: "#0971b7"
            rx: 5
            ry: 5

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
        position: {x: 20, y: 3}
        class: "title"
        texts: [
          {text: "AgChart Example", interline: -4.9}
          {text: "The agflow interactive library", interline: -4.9}
          {text: "Play with datas !"}
        ]
      label:
        x:
          text: "X Axis"
          offset: 10
          orient: "bottom"
        y:
          text: "Y Axis"
          orient: "right"
          offset: 0
      selector: null
      width: 600.0
      height: 400.0
      padding: [0,0] #left/right, bottom/top
      cross:
        x:
          show: true
          offset: 0
        y:
          show: true
          offset: 0
      crossValue:
        x:
          orient: 'bottom' # Top not implemented
          show: true
          format: (d) ->
            da = d.toString().split(" ")[2]
            m = d.toString().split(" ")[1]
            y = d.toString().split(" ")[3].substring(2)
            "#{da} #{m} #{y}"
    domain:
      x: margin: 5
      y: margin: 5
    logo:
      position: {x: 'right', y: 'bottom'}
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
        format: "%b"
        orient: "bottom"
        tick:
          mode: "auto" # TODO: wtf is this ?
          size: "auto"
          freq: "auto" # Every x tick
      y:
        format: null
        orient: "right"
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
        fa: "download"
        displayName: "Exports the chart to a PNG file"
        enable: true
        copyright:
          text: "(c) AgFlow 2014"
          color: "#9f9f9f"
          fontSize: 12
