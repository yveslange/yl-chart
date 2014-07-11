# This module force to draw some axis line
# at the correct place. It should be rendered
# after the grid !
module.exports = exp = {}

M = {
  style : require 'agchart/utils/style'
}

exp.Main = class Main
  constructor: (svg)->
    @_AXIS = svg.append("line")

  getDOM: ->
    return {root: @_AXIS}

  render: (params) ->
    confAxis = params.confAxis
    confCanvas = params.confCanvas
    new M.style.Main(@_AXIS).apply(params.style)
    switch confAxis.orient
      when 'bottom'
        @_AXIS
          .attr("x1", confCanvas.padding[0])
          .attr("y1", confCanvas.height-confCanvas.padding[1])
          .attr("x2", confCanvas.width- confCanvas.padding[0])
          .attr("y2", confCanvas.height-confCanvas.padding[1])
      when "top"
        @_AXIS
          .attr("x1", confCanvas.padding[0])
          .attr("y1", confCanvas.padding[1])
          .attr("x2", confCanvas.width-confCanvas.padding[0])
          .attr("y2", confCanvas.padding[1])
      when "left"
        @_AXIS
          .attr("x1", confCanvas.padding[0])
          .attr("y1", confCanvas.padding[1])
          .attr("x2", confCanvas.padding[0])
          .attr("y2", confCanvas.height-confCanvas.padding[1])
      when "right"
        @_AXIS
          .attr("x1", confCanvas.width-confCanvas.padding[0])
          .attr("y1", confCanvas.padding[1])
          .attr("x2", confCanvas.width- confCanvas.padding[0])
          .attr("y2", confCanvas.height-confCanvas.padding[1])
      else
        throw new Error("Unknown orientation: ", confAxis.orient)
