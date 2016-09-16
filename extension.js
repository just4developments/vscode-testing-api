var vscode = require('vscode');
var ApiController = require('./src/controller/api-controller');
var HistoryController = require('./src/controller/history-controller');
var StatusBar = require('./src/view/status-bar');

var apiController = new ApiController(false);
var apiHistory = new HistoryController();

exports.activate = (context) => {
  console.log('Congratulations, "Quick-test-api" is now active!');
  StatusBar.setup();
  context.subscriptions.push(apiController.register());  
  context.subscriptions.push(apiController.registerNewTab());
  context.subscriptions.push(apiHistory.register());
};

exports.deactivate = () => {
  console.log('"Quick-test-api" is now inactive!');
  StatusBar.dispose();
  apiRun1Tab,dispose();
  apiRunMTab,dispose();
};