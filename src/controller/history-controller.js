var vscode = require('vscode');
var HttpPreview = require('../view/http-preview');
var HistoryService = require('../service/history-service');
var tmp = require('tmp');
var fs = require('fs');

module.exports = class HistoryController {
  constructor(){
    
  }

  dispose() {
    
  }

  register(){
    var self = this;
    HistoryService.load();
    return vscode.commands.registerCommand('api.history', function() {
      vscode.window.showQuickPick(HistoryService.list.map(e=>{ 
        e.label = `${e.label0} >${HistoryService.getCreatedTime(new Date(e.date))}`; 
        return e;
      }), { placeHolder: "" }).then(item=>{
        if(!item) return;
        self.createTmpFile(item.raw, tmpFilePath => {
          vscode.workspace.openTextDocument(tmpFilePath).then((doc) => {
            vscode.window.showTextDocument(doc);
          });
        }, err => {
          vscode.window.showErrorMessage(err);
        });
      }, err=>{
        console.error(err);
      });
    });
  }

  createTmpFile(raw, fcDone, fcError){
    tmp.file({ prefix: 'vscode-api-', postfix: "" }, (err, tmpFilePath, fd) => {
      if (err) return fcError(err);
      fs.writeFile(tmpFilePath, raw, err => {
          if (err) return fcError(err);
          fcDone(tmpFilePath);
      });
  });
  }
}