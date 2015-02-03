// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config, type) {

  var files = [];

  switch (type) {

    // Using matsko's midway tester
    // @see https://github.com/yearofmoo/ngMidwayTester
    case 'midway':
      files = files.concat([

        // Tester deps & requirements
        'mocha.conf.js',
        'node_modules/chai/chai.js',
        'test/lib/chai-should.js',
        'test/lib/chai-expect.js',

        // Tester
        'node_modules/ng-midway-tester/src/ngMidwayTester.js',

        // Tests
        'test/midway/**/*.js'
      ]);
      break;

    default:
      files = files.concat([
        'test/spec/**/*.js'
      ]);
      break;
  };

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      // 'app/bower_components/angular-mocks/angular-mocks.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/underscore/underscore.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js'
    ].concat(files),

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 80,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Visual progress feedback
    reporters: ['dots']
  });
};
