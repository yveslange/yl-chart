module.exports = exp = {}

exp.Main = class Main
  constructor:(params={}) ->
    @_CONF =
      lang: params.lang ? 'enl'

    @_DATE = new Date()
    @_TIMESTAMP = @_DATE.getTime()
    @_MONTHSNAME = {}
    @_MONTHSNAME.en = ['Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec']
    @_MONTHSNAME.enl = ['January','February','March','April','May','June',
      'July','August','September','October','November','December']
    @_MONTHSNAME.fr = ['Jan','Fév','Mar','Avr','Mai','Juin',
      'Juil','Août','Sep','Oct','Nov','Déc']
    @_MONTHSNAME.frl = ['Janvier','Février','Mars','Avril','Mai','Juin',
      'Juil','Août','Septembre','Octobre','Novembre','Décembre']

  monthsName: ->
    @_MONTHSNAME[@_CONF.lang]

  getMonth: ->
    @monthsName()[@_DATE.getMonth()]
  getDay: ->
    @_DATE.getDay()
  getFullDate: ->
    @_DATE.getDay()+" "+@getMonth()+" "+@_DATE.getYear()+" "+
      @_DATE.getHours()+":"+@_DATE.getMinutes()


  getDate: ->
    return @_DATE

  setTimestamp: (t) ->
    return @_TIMESTAMP if not t?
    @_DATE = new Date(parseInt(t)*1000)
    @_TIMESTAMP = parseInt(t)

