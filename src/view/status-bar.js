const vscode = require('vscode');
const elegantSpinner = require('elegant-spinner');
const spinner = elegantSpinner();

class StatusBar {

}
StatusBar.items = {};
StatusBar.setup = () => {
  StatusBar.items.duration = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  StatusBar.items.duration.show();
  var interval;
  StatusBar.items.duration.pending = ()=>{
    interval = setInterval(() => {
        StatusBar.items.duration.text = `Sending ${spinner()}`;
    }, 50);
    StatusBar.items.duration.tooltip = 'Waiting Response';
  }
  StatusBar.items.duration.done = (duration)=>{
    StatusBar.items.duration.text = `$(clock) ${duration} ms`;
    StatusBar.items.duration.tooltip = `Executing time`;
    clearInterval(interval);
  }
}

StatusBar.dispose = () => {
  for(var k in StatusBar.items){
    StatusBar.items[k].hide();
    StatusBar.items[k].dispose();
  }
}

module.exports = StatusBar;