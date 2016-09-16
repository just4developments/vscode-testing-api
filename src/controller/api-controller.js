var vscode = require('vscode');
var HttpPreview = require('../view/http-preview');
var StatusBar = require('../view/status-bar');
var httpRequest = require('../service/http-request');
var HistoryService = require('../service/history-service');

module.exports = class ApiController {
  constructor(isNewTab){
    this.isNewTab = isNewTab;
    this.httpPreview = new HttpPreview(isNewTab);       
  }

  dispose() {
    
  }

  register(cmd){
    var self = this;
    this.registration = this.httpPreview.register('api-response-preview', this.isNewTab);
    this.disposable = vscode.commands.registerCommand(cmd, function() {
      var editor = vscode.window.activeTextEditor;
      if (!editor) return;
      self.httpPreview.update();
      StatusBar.items.duration.pending();
      var api;
      try{
        api = self.getApi(editor);
      }catch(e){
        vscode.window.showErrorMessage(e);
        StatusBar.items.duration.done(-1);
        return;
      }
      HistoryService.add({
        label0: `${api.method.toUpperCase()} ${api.url}`,
        description: api.des || '',
        raw: api.raw,
        date: new Date().getTime()
      });
      var now = new Date().getTime();      
      httpRequest.send(api, (res) => {
        res.duration = new Date().getTime() - now;
        StatusBar.items.duration.done(res.duration);
        self.httpPreview.update(res);
      });
    });
  }

  getApi(editor){
    var cnt;
    var api;
    if (editor.selection.isEmpty) {
      cnt = editor.document.getText();
    }else{
      cnt = editor.document.getText(editor.selection);
    }
    cnt = cnt.replace(/^[^\[\{]+/g, '').replace(/[^\]\}]+$/g, '').trim();
    try{
      eval(`api=${cnt}`);
      api.raw = cnt;
    }catch(e){
      throw 'format is error';
    } 
    if (!api.url) throw 'url is required';
    if (!api.method) api.method = "get";
    api.method = api.method.toLowerCase();
    return api;
  }
}