var factory=function(request,exports,modelName,actionName,mainFn,linkModel,linkAction,reactive){
  if(!exports||!modelName||!actionName||!mainFn){
    return false;
  }
  var main=function(socket,data,fn,end,reactiveData){
      console.log("reactiveData:"+reactiveData);
      console.log(modelName+"/"+actionName);
      if(typeof(data.data)=="string"){
        data.data=JSON.parse(data.data)
        }
      console.log(data.data);
      var result={code:0,
        time:0,
        data:{},
        success:false,
        message:""};
      var returnFn=function(){
        if(socket){
        socket.emit(modelName+"_"+actionName,result);
       }
        else if(fn){
          var returnString = JSON.stringify(result);
          fn(returnString);
        }
      }
      function errFn(err,message){
        result.success=false;
        console.log(err);
        result.message=message;
        returnFn();
      }
	  function scFn(returnData){
            if(linkModel&&linkAction){
                if(end){
                if(reactive){
                  result.data=reactiveData;
                }else{
                  result.data=returnData;
                }
                result.success=true;
                result.code=1;
                result.time=new Date().getTime();
                console.log(result)
                returnFn();
              }else{
                var activeData={};
                if(!reactive){
                  activeData=returnData;
                }
                server[linkModel][linkAction](socket,data,fn,true,activeData);  
              }
            }else{
              result.data=returnData;
                result.success=true;
                result.code=1;
                result.time=new Date().getTime();
                console.log(result)
                returnFn();
            }
          }
      function successFn(returnData,cache){
        if(_.size(cache)){
          var total=_.size(cache);
          var totalCount=0;
          function saveSC(err,doc){
            if(err){
              result.success=false;
              console.log(err);
              result.message=message;
              returnFn();
            }else{
              totalCount++;
              if(total==totalCount){
                scFn(returnData);
              }
            }
          }
          _.each(cache,function(point){
            point.save(saveSC);
          });
        }else{
          scFn(returnData);
        }
      }
      var cache={};
      if(!request){
         mainFn(cache,data.data,successFn,errFn);
       }else{
		var newRequest=(function(data){
       return eval('('+request+')');
    })(data.data);
        data_mg[modelName].find(newRequest,function(err,doc){
			if(!err){
				cache=_.indexBy(doc,"id");
				mainFn(cache,data.data,successFn,errFn);
				}else{
					errFn(err);
					}
        });
       }
  }
  exports[actionName]=function(socket,data,fn,end,reactiveData){
    main(socket,data,fn,end,reactiveData);
  }
}
module.exports=factory;