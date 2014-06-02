# Here are all the configuration options that can be used to customize agChart

```Javascript
  # singlePoint, multipleVertical, multipleVerticalInverted
  mode = "multipleVerticalInverted"
  #mode = "multipleVertical"
  #mode = "singlePoint"

  agChart = new agchart.Main(
    config:
      canvas: # General configuration of the chart

        render: 'dotline' # Render mode, availables options:
          # - dot: only circles/dots for each series
          # - line: only lines for each series
          # - dotline: circles/dots linked with a line for each series

        title: # Title that appears in the top of the container
          color: "#4f4f4f" # Color of the title
          size: 24
          text: "AgChart"
        label:
          x:
            text: "Some label X"
            size: 10
            color: "#7f7f7f"
          y:
            text: "Some label Y"
            size: 10
            color: "#7f7f7f"
        selector: '#chart1'
        padding: [30,30]
        cross:
          x:
            show: true
            color: "#44A0FF"
          y:
            show: true
            color: "#FFA044"
      logo:
        url: "agflow-logo.png"
        width: 100
        height: 50
        x: 'right'
        y: 'bottom'
        opacity: 0.3
      tooltip:
        template: mode
        callback: mode
        format:
          x: tooltipFormat
      point:
        onMouseover: mode
        onMouseout: mode
        mode: 'fill'
        r: 3
        color: 'paired' # Color or palette name
        stroke: {width: 1, color: null}
      axis:
        y:
          tickSize: "full"
        x:
          format: "%b"
          tickSize: "full"
    series: [
      {
        name: "Serie 1"
        data: genData(24*3600*120, 24*3600)
        config:
          stroke: {width: 1}
      }
      {
        name: "Serie 2"
        data: genData(24*3600*120, 36*3600*2)
        config:
          color: "#ff0001"
          stroke: {width: 1}
      }
      {
        name: "Serie 3"
        data: genData(24*3600*120, 48*3600)
        config:
          #color: "#00fffe"
          stroke: {width: 1}
      }
    ]
  )
```
