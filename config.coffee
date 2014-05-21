# Brunch.io configuration file
exports.config =
  path:
    public: 'public'
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/app.js': /^app/
#      order:
#        before: [
#          'bower_components/jquery/dist/jquery.js'
#        ]
    stylesheets:
      joinTo: 'css/app.css': /^app\/styles\//
