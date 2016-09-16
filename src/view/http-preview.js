const vscode = require('vscode');
const path = require('path');
const hljs = require('highlight.js');

class HttpPreview {

  constructor(isNewTab){
    this._onDidChange = new vscode.EventEmitter();    
    this.isNewTab = isNewTab;
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

  update(response) {
    this.response = response;    
    if(this.isNewTab && this.response === undefined) HttpPreview.index++;
    this._onDidChange.fire(this.uri);
    vscode.commands.executeCommand('vscode.previewHtml', this.uri, vscode.ViewColumn.Two, `${HttpPreview.index}. Response`);
  }

  provideTextDocumentContent(scheme, provider){
    var assets = path.join(vscode.extensions.getExtension('just4developments.testing-api').extensionPath, 'assets');
    var previewCss = path.join(assets, 'styles', 'preview.css');
    var highlightCss = path.join(assets, 'styles', 'monokai-sublime.css');
    if(this.response === undefined)
      return `Sending...`;
    return `
      <head>
          <link rel="stylesheet" href="${previewCss}">
      </head>
      <body>
        <details>
          <summary>
            <b class="status status-${this.response.statusCode}">${this.response.request.method.toUpperCase()}</b> <span>${this.response.request.href}</span>
          </summary>
          <pre><code class="http">${hljs.highlight('http', `HTTP/${this.response.httpVersion} ${this.response.statusCode} ${this.response.statusMessage}
${this.formatHeader(this.response.headers)}`, true).value}</code></pre>
        </details>
        <pre><code class="http">${hljs.highlight('http', this.formatBody(this.response.body, this.response.headers['content-type']), true).value}</code></pre>
      </body>
    `;
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
  formatBody(body, type){
    if('application/json' === type){
      return JSON.stringify(body, null, 2);
    }
    return JSON.stringify(body, null, 2);
  }
}
HttpPreview.index = 1;
module.exports = HttpPreview;