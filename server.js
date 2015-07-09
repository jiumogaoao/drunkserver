var http = require("http");
var router = require("./router")
var target = null;


  function onRequest(request, response) {
    router.route(request,function(data){
        response.writeHead(200,{
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS",
          "X-Powered-By":' 3.2.1',
          "Content-Type": "application/json;charset=utf-8"
        });
    response.end(data);
    });
      
    
    
  }
  target=http.createServer(onRequest).listen(8888);
  console.log("Server has started.");


exports.target = target;