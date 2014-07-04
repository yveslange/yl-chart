module.exports = exp = {}

# Effects for the events
exp.singlePoint =
  onMouseover: (params) ->
    _circleNode = params.circleNode
    curStrokeWidth =
      parseFloat( _circleNode.getAttribute("stroke-width") )
    _circleNode.setAttribute("stroke-width", curStrokeWidth*2)
  onMouseout: (params) ->
    _circleNode = params.circleNode
    curStrokeWidth =
      parseFloat( _circleNode.getAttribute("stroke-width") )
    _circleNode.setAttribute("stroke-width", curStrokeWidth/2)

exp.multipleVertical =
  onMouseover:  (params) ->
    _circleNode = params.circleNode
    cx = _circleNode.getAttribute('cx')
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))*2
    $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
      $(node).attr("stroke-width", strokeWidth)
    )
  onMouseout: (params) ->
    _circleNode = params.circleNode
    cx = _circleNode.getAttribute('cx')
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))/2
    $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
      $(node).attr("stroke-width", strokeWidth)
    )

exp.multipleVerticalInverted =
  onMouseover:  (params) ->
    _circleNode = params.circleNode
    cx = _circleNode.getAttribute('cx')
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))*2
    $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
      $(node).attr("stroke-width", strokeWidth)
      fill = $(node).attr("fill")
      stroke = $(node).attr("stroke")
      $(node).attr("stroke", fill)
      $(node).attr("fill", stroke)
    )

  onMouseout: (params) ->
    _circleNode = params.circleNode
    cx = _circleNode.getAttribute('cx')
    strokeWidth = parseFloat(_circleNode.getAttribute('stroke-width'))/2
    $(params.canvas[0]).find("circle[cx='#{cx}']").each((e, node)->
      $(node).attr("stroke-width", strokeWidth)
      fill = $(node).attr("fill")
      stroke = $(node).attr("stroke")
      $(node).attr("stroke", fill)
      $(node).attr("fill", stroke)
    )
