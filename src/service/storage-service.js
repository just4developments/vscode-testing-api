var vscode = require('vscode');
var fs = require('fs');
var path = require('path');
var dbFile = {
  history: path.join(vscode.extensions.getExtension('just4developments.testing-api').extensionPath, 'history.db')
};

class StorageService {

}
StorageService.save = (key, data) => {
  if(data !== undefined) data = JSON.stringify(data);
  fs.writeFileSync(dbFile[key], data);
}
StorageService.getData = (key) =>{
  try{
    return fs.readFileSync(dbFile[key]).toString();
  }catch(e){
    return undefined;
  }
}
module.exports = StorageService;