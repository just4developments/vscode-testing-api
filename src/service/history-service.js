var vscode = require('vscode');
var StorageService = require('./storage-service');

class HistoryService{
  
}
HistoryService.list = [];
HistoryService.getCreatedTime = (date)=>{
  var r = new Date().getTime() - date.getTime();
  var s = Math.floor(r/1000);
  if(s < 1) return `${r}ms`;
  var m = Math.floor(s/60);
  if(m < 1) return `${s%60}sec`;
  var h = Math.floor(m/60);
  if(h < 1) return `${m%60}min`;
  var d = Math.floor(h/24);
  if(d < 1) return `${h%24}hr`;
  if(d <= 3) return `${d}day`;
  return date.toLocaleDateString();
}
HistoryService.load = () => {
  HistoryService.MAX_HISTORY = vscode.workspace.getConfiguration('history').get('maxStored', 100);
  var cnt = StorageService.getData('history');
  if(cnt) HistoryService.list = JSON.parse(cnt);  
}
HistoryService.add = (item) => {
  HistoryService.list.splice(0, 0, item);
  if(HistoryService.list.length > HistoryService.MAX_HISTORY) HistoryService.list = HistoryService.list.slice(0, HistoryService.MAX_HISTORY);
  StorageService.save('history', HistoryService.list);
}
module.exports = HistoryService;