var url = require("url");
var query = require("querystring");
var event = require("./event");

//计算
var compute = function(params){  
    switch(params['type']){
        case "add": return parseFloat(params['num']) + parseFloat(params['num1']);break;
        case "subtract": return parseFloat(params['num']) - parseFloat(params['num1']);break;
        case "multiplication": return parseFloat(params['num']) * parseFloat(params['num1']);break;
        case "division": return parseFloat(params['num']) / parseFloat(params['num1']);break;
    }
}

function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };

function route(request,fn) {
    //判断是GET/POST请求
    event.callBackFn(fn);
    if(request.method == "GET"){
		console.log("GET");
        var params = [];
        params = url.parse(request.url,true).query;
        params['fruit'] = compute(params);
		params.ip=getClientIp(request);
		console.log(params)
        event.catchs(params);

    }else{
        var postdata = "";
        request.addListener("data",function(postchunk){
            postdata += postchunk;
        })

        //POST结束输出结果
        request.addListener("end",function(){
            var params = query.parse(postdata);
            params['fruit'] = compute(params);
			params.ip=getClientIp(request);
            event.catchs(params);
        })
    }
event.run('server')

}

exports.route = route;