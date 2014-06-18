module.exports = exp = {}

exp.Main = class Main
  constructor: (palette) ->
    _palettes = @palettes()
    @_PALETTE = _palettes[palette]
    @_INDEX = 0

  isDefined: ->
    if @_PALETTE?
      return true
    return false

  color: (i) ->
    # Get the next color
    return @_PALETTE[i%@_PALETTE.length]

  palettes: ->
    schemes = {}
    schemes.spectrum14 = ['#ecb796','#dc8f70','#b2a470','#92875a',
      '#716c49','#d2ed82','#bbe468','#a1d05d','#e7cbe6','#d8aad6',
      '#a888c2','#9dc2d3','#649eb9', '#387aa3'].reverse()

    schemes.spectrum2000 = ['#57306f','#514c76','#646583','#738394',
      '#6b9c7d','#84b665','#a7ca50','#bfe746','#e2f528','#fff726',
      '#ecdd00','#d4b11d','#de8800','#de4800','#c91515','#9a0000',
      '#7b0429','#580839','#31082b']

    schemes.spectrum2001 = ['#2f243f','#3c2c55','#4a3768','#565270',
      '#6b6b7c','#72957f','#86ad6e','#a1bc5e','#b8d954','#d3e04e',
      '#ccad2a','#cc8412','#c1521d','#ad3821','#8a1010','#681717',
      '#531e1e','#3d1818','#320a1b']

    schemes.classic9 = ['#423d4f','#4a6860','#848f39','#a2b73c',
      '#ddcb53','#c5a32f','#7d5836','#963b20','#7c2626','#491d37',
      '#2f254a'].reverse()

    schemes.httpStatus = {
      503: '#ea5029', 502: '#d23f14', 500: '#bf3613'
      410: '#efacea',409: '#e291dc',403: '#f457e8',408: '#e121d2',401: '#b92dae'
      405: '#f47ceb',404: '#a82a9f',400: '#b263c6',301: '#6fa024',302: '#87c32b'
      307: '#a0d84c',304: '#28b55c',200: '#1a4f74',206: '#27839f',201: '#52adc9'
      202: '#7c979f',203: '#a5b8bd',204: '#c1cdd1'}

    schemes.colorwheel = ['#b5b6a9','#858772','#785f43','#96557e',
      '#4682b4','#65b9ac','#73c03a','#cb513a'].reverse()

    schemes.cool = ['#5e9d2f','#73c03a','#4682b4','#7bc3b8','#a9884e',
      '#c1b266','#a47493','#c09fb5']

    schemes.munin = ['#00cc00','#0066b3','#ff8000','#ffcc00','#330099',
      '#990099','#ccff00','#ff0000','#808080','#008f00','#00487d',
      '#b35a00','#b38f00','#6b006b','#8fb300','#b30000','#bebebe',
      '#80ff80','#80c9ff','#ffc080','#ffe680','#aa80ff','#ee00cc',
      '#ff8080','#666600','#ffbfff','#00ffcc','#cc6699','#999900']

    schemes.paired = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99",
        "#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

    schemes.agflow = ["#0099ef","#ff009d","#56b501","#ffee52","#a34100","#0018ef","#ff89d2","#6ee801","#ef0018","#ffa468","#00efd7","#b3006e","#aefe66","#ed7446","#572200","#0010a3","#326901"]
    return schemes
