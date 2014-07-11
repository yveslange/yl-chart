module.exports = exp = {}


exp.Main = class Main
  constructor: (DOM) ->
    @DOM = DOM

  apply: (styles) ->
    for sK, sV of styles
      @DOM.attr(sK, sV)
    return @DOM
