const vscode = require('vscode');
const path = require('path');
const hljs = require('highlight.js');

const assets = path.join(vscode.extensions.getExtension('just4developments.testing-api').extensionPath, 'assets');
const previewCss = path.join(assets, 'styles', 'preview.css');
const highlightCss = path.join(assets, 'styles', 'monokai-sublime.css');

class HttpPreview {

  constructor(){
    this._onDidChange = new vscode.EventEmitter();
  }

  get uri(){
    return `${this.schema}://authority/${this.schema}/${HttpPreview.index}`;
  }

  register(schema){
    this.schema = schema;
    return vscode.workspace.registerTextDocumentContentProvider(schema, this);
  }

  get onDidChange() {
    return this._onDidChange.event;
  }

  update(response, isNewTab) {
    this.response = response;
    if(isNewTab && this.response === undefined) HttpPreview.index++;
    this._onDidChange.fire(this.uri);
    vscode.commands.executeCommand('vscode.previewHtml', this.uri, vscode.ViewColumn.Two, `${HttpPreview.index}. Response`);
  }

  provideTextDocumentContent(scheme, provider){
    if(this.response === undefined)
      return `Sending...`;
    var responseType;
    if(this.response.headers && this.response.headers['content-type']){
      responseType = this.response.headers['content-type'].toLowerCase();
      if(responseType.indexOf('html') !== -1){
        responseType = 'xml';
      }else if(responseType.indexOf('xml') !== -1){
        responseType = 'xml';
      }else if(responseType.indexOf('json') !== -1){
        responseType = 'json';
      }else if(responseType.indexOf('image') !== -1){
        responseType = 'image';
        this.response.body = undefined;
      }else{
        responseType = undefined;
      }
    }
    try{
      var rs = `<head>
          <link rel="stylesheet" href="${previewCss}">
      </head>
      <body>
        <details ${this.response.body === undefined ? 'open' : ''}>
          <summary>
            <b class="status status-${this.response.statusCode}">${this.response.request.method.toUpperCase()}</b> <span>${this.response.request.href}</span>
          </summary>
          <pre><code class="http">${hljs.highlight('http', `HTTP/${this.response.httpVersion} ${this.response.statusCode} ${this.response.statusMessage}
${this.formatHeader(this.response.headers)}`, true).value}</code></pre>
        </details>`; 
        if(this.response.body !== undefined){
          if(responseType){
            rs += `<pre><code class="${responseType}">${hljs.highlight(responseType, this.formatBody(this.response.body, responseType), true).value}</code></pre>`;
          }else{
            rs += `<pre><code class="${responseType}">${this.formatBody(this.response.body, responseType)}</code></pre>`;
          }
        }
      rs += '</body>';
      return rs;
    }catch(e){
      if(this.response.error)
        vscode.window.showErrorMessage(`[${this.response.error.code}] ${this.response.error.message}`);
      else
        vscode.window.showErrorMessage(e);
    }
    return '';
  }

  dispose(){
    
  }
  
  formatHeader(header){
    var rs = [];
    for(var i in header){
      rs.push(`${i}: ${header[i]}`);
    }
    return rs.join('\n');
  }
  formatBody(body, type, contentType){
    if('json' === type){
      return JSON.stringify(body, null, 2);
    }
    return body;
  }
}
HttpPreview.index = 1;
module.exports = HttpPreview;