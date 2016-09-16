var vscode = require('vscode');
var ApiController = require('./src/controller/api-controller');
var HistoryController = require('./src/controller/history-controller');
var StatusBar = require('./src/view/status-bar');

var apiRun1Tab = new ApiController(false);
var apiRunMTab = new ApiController(true);
var apiHistory = new HistoryController();

exports.activate = (context) => {
  console.log('Congratulations, "Quick-test-api" is now active!');
  StatusBar.setup();
  // context.subscriptions.push(apiRun1Tab);
  // context.subscriptions.push(apiRunMTab);
  apiRun1Tab.register('api.run');
  apiRunMTab.register('api.runNewTab');
  apiHistory.register('api.history');

  context.subscriptions.push(apiRun1Tab.disposable, apiRun1Tab.registration);  
  context.subscriptions.push(apiRunMTab.disposable, apiRunMTab.registration);
  context.subscriptions.push(apiHistory.disposable);
};

exports.deactivate = () => {
  console.log('"Quick-test-api" is now inactive!');
  StatusBar.dispose();
  apiRun1Tab,dispose();
  apiRunMTab,dispose();
};