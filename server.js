//var http = require("https");
var http = require("http");
var fs = require("fs");
var router = require("./router")
var target = null;


  function onRequest(request, response) {
    //router.route(request,function(data){
    //    response.writeHead(200,{
    //      "Access-Control-Allow-Origin":"*",
    //      "Access-Control-Allow-Headers": "X-Requested-With",
    //      "Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS",
    //      "X-Powered-By":' 3.2.1',
     //     "Content-Type": "application/json;charset=utf-8"
    //    });
    //response.end(data);
    //});
    response.writeHead(200);  
    response.end('hello world\n');  
    
    
  }
  var opt={
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.pem'),
	requestCert: true
	  }
 // target=http.createServer(opt,onRequest).listen(8888);
  target=http.createServer(onRequest).listen(8888);


exports.target = target;