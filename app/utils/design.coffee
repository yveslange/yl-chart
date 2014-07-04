module.exports = exp = {}

# Computes the padding automatically to display correctly the
# graph and dots
exp.computePadding = computePadding = (confPoint) ->
  pad = confPoint.r+confPoint.stroke.width/2.0
  [pad,pad]
