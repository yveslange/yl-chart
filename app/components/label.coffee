module.exports = exp = {}
M = {
  style : require 'agchart/utils/style'
}

exp.Main = class Main
  constructor: (svg) ->
    @_LABEL = svg.append("text")

  getDOM: ->
    return {root: @_LABEL}

  render: (params) ->
    confCanvas = params.confCanvas
    confLabel = params.confLabel
    style = params.style
    offset  = confLabel.offset || 0

    new M.style.Main(@_LABEL).apply(style)
      .text(confLabel.text)

    textDim = @_LABEL.node().getBBox()

    switch confLabel.orient
      when 'bottom'
        trans = "translate(#{confCanvas.width/2},
          #{confCanvas.height-confCanvas.padding[1]+textDim.height+offset})"
      when 'top'
        trans = "translate(#{confCanvas.width/2}, #{confCanvas.padding[1]-offset})"
      when 'left'
        trans =
          "rotate(-90) translate(#{-confCanvas.height/2}, #{confCanvas.padding[0]+10})"
      when 'right'
        trans =
          "translate(#{confCanvas.width-confCanvas.padding[0]}, #{confCanvas.padding[1]/2})"
      else
        trans = ''
        throw new Error("Unknown orientation: ", confLabel.orient)

    @_LABEL.attr("transform", trans)
