var vscode = require('vscode');
var HttpPreview = require('../view/http-preview');
var StatusBar = require('../view/status-bar');
var httpRequest = require('../service/http-request');
var HistoryService = require('../service/history-service');

module.exports = class ApiController {
  constructor(){
    this.httpPreview = new HttpPreview(); 
    this.registration = this.httpPreview.register('api-response-preview');      
  }

  dispose() {
    
  }

  register(){
    var self = this;
    return vscode.commands.registerCommand('api.run', function() {
      self.run(false);
    });
  }
  registerNewTab(){
    var self = this;
    return this.disposableNewTab = vscode.commands.registerCommand('api.runNewTab', function() {
      self.run(true);
    });
  }

  run(isNewTab){
    var self = this;    
    var editor = vscode.window.activeTextEditor;
    if (!editor) return;
    StatusBar.items.duration.pending();
    self.httpPreview.update(undefined, isNewTab);
    var api;
    try{
      api = this.getApi(editor);
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
    setTimeout(() => {
      var now = new Date().getTime();
      httpRequest.send(api, (res) => {
        res.duration = new Date().getTime() - now;
        StatusBar.items.duration.done(res.duration);
        self.httpPreview.update(res, isNewTab);
      });
    }, 100);
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