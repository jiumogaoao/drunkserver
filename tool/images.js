var images=function(img,name,size){
    if(!size.length){
      return false;
    }
    size = _.sortBy(size,function(point){return -1*point});
    var newId = tool.uuid();
    var src = images(img);
    _.each(size,function(point){
      src.resize(point).save(name+"_"+newId+"_"+point+".jpg",{operation:100});
    });
    return name+"_"+newId;
  }
module.exports=images;