// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    singleRun: true,
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      "src/styles.css",
      "Semantic-UI-2.5.0/dist/semantic.css",
      "node_modules/semantic-ui-calendar/dist/calendar.css",
      "node_modules/leaflet/dist/leaflet.css",
      "node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css",
      "node_modules/prismjs/themes/prism.css",
      "node_modules/prismjs/components/prism-core.js",
      "node_modules/jquery/dist/jquery.js",
      "Semantic-UI-2.5.0/dist/semantic.js",
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    colors: false,
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      type: 'lcovonly'
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromiumHeadless'],
    restartOnFileChange: false
  });
};
