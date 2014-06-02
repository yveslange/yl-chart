# Brunch.io configuration file
exports.config =
  path:
    public: 'public'
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/agchart.js': /^app/
    stylesheets:
      joinTo: 'css/agchart.css': /^app\/styles\//
