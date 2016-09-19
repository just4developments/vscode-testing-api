var unirest = require('unirest');

exports = module.exports = {
  handleForm: (req, requestBody) => {
    var files;
    for(var k in requestBody){			
      if(k.indexOf('file:') === 0){
        var key = k.substr('file:'.length);
        if(!files) files = {};
        files[key] = requestBody[k];
        delete requestBody[k];
      }
    }
    if(files){
      for(var k in files){
        if(files[k] instanceof Array){
          for(var i in files[k]){
            req = req.attach(k, files[k][i]);
          }
        }else{
          req = req.attach(k, files[k]);
        }
      }
      for(var k in requestBody){
        req = req.field(k, requestBody[k]);
      }		
    }
    return req;
  },
  send: (config, fcDone) => {
    var requestBody;
    if(config.requestBody !== undefined) requestBody = Object.assign({}, config.requestBody);
    var transformRequest = (config.requestHeader && config.requestHeader['content-type']) ? config.requestHeader['content-type'].toLowerCase() : undefined;
    if('multipart/form-data' === transformRequest || 'application/x-www-form-urlencoded' === transformRequest) transformRequest = 'form';
    else if('application/json' === transformRequest) transformRequest = 'json';
    else transformRequest = undefined;
    if ('post' === config.method) {
      req = unirest.post(config.url);      
      if(requestBody !== undefined){
        if('form' === transformRequest) req = exports.handleForm(req, requestBody);
        else if('json' === transformRequest) req = req.send(JSON.stringify(requestBody));
        else req = req.send(requestBody);
      }  
    } else if ('put' === config.method) {
      req = unirest.put(config.url);
      if(requestBody !== undefined){
        if('form' === transformRequest) req = exports.handleForm(req, requestBody);
        else if('json' === transformRequest) req = req.send(JSON.stringify(requestBody));
        else req = req.send(requestBody);
      }
    } else if ('delete' === config.method) {
      req = unirest.delete(config.url);
    } else if ('head' === config.method) {
      req = unirest.head(config.url);
    } else {
      req = unirest.get(config.url);
    }
    if (config.requestHeader) req = req.headers(config.requestHeader); 
    req.end(fcDone);
  }
}