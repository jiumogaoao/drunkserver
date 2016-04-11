function get(socket,data,fn){
	console.log("deal/get");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:true,
		message:""};
	function returnFn(){
		if(socket){
	 	socket.emit("deal_getdeal",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}	
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==2){
		data_mg.deal.find({},function(err,doc){
			if(err){
				console.log(err);
				result.success=false;
				result.message="获取交易列表失败";
				}else{
					result.success=true;
					result.data=doc;
					result.code=1;
					}
				returnFn();
			});
		}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}
};
/**************************************************************************************************/
function add(socket,data,fn){
	console.log("deal/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={success:false,
		code:0,
		message:"",
		data:{},
		time:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		};
		console.log(tokenArry[data.data.tk])
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		console.log("已登陆")
		data_mg.client.findOne({id:tokenArry[data.data.tk].user.id},function(err,member){
			if(err){
				console.log(err);
				result.success=false;
				result.message="获取用户信息失败";
				returnFn();
			}else{
				console.log("用户信息正确")
				var restMoney=member.balance+member.redpacket;
				var coverCount=0;
				var coverArry=[];
				var coverErr=1;
				var coverErrSend=1;
				var totalPrice=0;
				var shopId="";
				function coverCallBack(){
					coverCount++;
					if(coverCount==data.data.product.length){
						data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(productTimeErr){
							if(productTimeErr){
								console.log(productTimeErr);
								result.success=false;
								result.message="产品时间更新失败";
								returnFn();
								}else{
									var newdeal=new data_mg.deal({
							"id":uuid(),/*id*/
							"product":coverArry,/*商品*/
							"userId":tokenArry[data.data.tk].user.id,/*用户id*/
							"shopId":shopId,/*商户Id*/
							"startTime":new Date().getTime(),/*购买时间*/
							"shopName":data.data.shopName,/*商家名*/
							"name":tokenArry[data.data.tk].user.userName,/*用户名*/
							"phone":tokenArry[data.data.tk].user.phone,/*用户手机号*/
							"state":0,/*0没支付,1已支付,2没发货,3已发货,4已收货,5已评价,6已取消*/
							"logistics":"",/*物流*/
							"logNumber":"",/*物流单号*/
							"star":0,/*评分*/
							"com":"",/*评价*/
							"comTime":0,/*评价时间*/
							"totalPrice":totalPrice/*总价*/
						})
						newdeal.save(function(dealErr){
							if(dealErr){
								console.log(dealErr);
								result.success=false;
								result.message="添加交易记录失败";
								returnFn();
							}else{
								result.success=true;
								result.code=1;
								returnFn();
							}
						});
									}
							})
						
					}
				}
				function addProduct(num,pobject){
					data_mg.product.findOne({id:pobject.id},function(findProductErr,product){
						if(coverErr){
							if(findProductErr){
								coverErr=0;
								console.log(findProductErr);
								result.success=false;
								result.message="获取商品信息失败";
								if(coverErrSend){
									coverErrSend=0;
									returnFn();
								}
							}else{
								console.log("有该商品")
								shopId=product.shopId;
								var priceObject={};
								for(var i=0;i<product.price.length;i++){
									priceObject[product.price[i].id]=product.price[i];
								}
								if(priceObject[pobject.modelId]){
									console.log("有该类型")
									if(priceObject[pobject.modelId].count>=pobject.count){
										console.log("库存足够")
										totalPrice+=priceObject[pobject.modelId].price*pobject.count;
										console.log("添加到替换列表")
										coverArry[num]={id:product.id,name:product.title,modelId:pobject.modelId,price:priceObject[pobject.modelId].price,count:pobject.count,modelName:product.title,modelIcon:product.image[0],modelString:pobject.modelString}
										priceObject[pobject.modelId].count-=pobject.count;
										console.log("减库存")
										data_mg.product.update({id:pobject.id},{$set:{model:product.price}},{},function(modelCountErr){
											if(modelCountErr){
												console.log(modelCountErr);
												coverErr=0;
												result.success=false;
												result.message="获取商品信息失败";
												if(coverErrSend){
													coverErrSend=0;
													returnFn();
												}
											}else{
												console.log("减库存成功");
												coverCallBack();
											}
										})
									}else{
										coverErr=0;
										console.log("库存不足");
										result.success=false;
										result.message="库存不足";
										if(coverErrSend){
											coverErrSend=0;
											returnFn();
										}
									}
								}else{
									coverErr=0;
									console.log("没该类型");
									result.success=false;
									result.message="获取商品类型失败";
									if(coverErrSend){
										coverErrSend=0;
										returnFn();
									}
								}
								

							}
						}
						

					})
				}

				for (var i=0;i<data.data.product.length;i++){
					addProduct(i,data.data.product[i]);
				}

			}
			
		})	
		}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}		
};

/*****************************************************************************************************/
function cancel(socket,data,fn){
	console.log("deal/cancel");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_list",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
			data_mg.deal.$where('this.id == "'+data.data.id+'" && (this.userId == "'+tokenArry[data.data.tk].user.id+'" || this.shopId == "'+tokenArry[data.data.tk].user.id+'")').exec(function(err,doc){
				if(err||doc.length==0){
					console.log(err);
					result.success=false;
					result.message="该订单不存在";
					returnFn();
				}else{
					doc=doc[0];
					if(doc.state==0){
						data_mg.deal.update({id:data.data.id},{$set:{state:5}},{},function(errDeal){
							if(errDeal){
								console.log(errDeal);
								result.success=false;
								result.message="该订单不存在";
								returnFn();
							}else{
								result.success=true;
								result.code=1;
								returnFn();
							}
						});
					}else{
						console.log("订单已支付，无法取消");
						result.success=false;
						result.message="订单已支付，无法取消";
						returnFn();
					}
				}
			});
			}else{
				result.success=false;
				result.message="登陆信息超时";
				returnFn();
				}
	}
/*****************************************************************************************************/
function pay(socket,data,fn){
	console.log("deal/pay");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_pay",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.deal.findOne({id:data.data.id,userId:tokenArry[data.data.tk].user.id},function(dealErr,doc){
			if(dealErr){
				console.log(dealErr);
				result.success=false;
				result.message="该订单不存在";
				returnFn();
			}else{
				if(doc.state==0){
					data_mg.client.findOne({id:tokenArry[data.data.tk].user.id},function(userErr,user){
						if(userErr){
							console.log(userErr);
							result.success=false;
							result.message="用户信息获取错误";
							returnFn();
						}else{
							var restMoney=user.balance+user.redpacket;
							if(restMoney>=doc.totalPrice){
								var moneySet=0;
					if(user.redpacket>=doc.totalPrice){
						moneySet={balance:user.balance,redpacket:(user.redpacket-doc.totalPrice)}
					}else{
						moneySet={balance:user.balance+user.redpacket-doc.totalPrice,redpacket:0}
					}
					data_mg.client.update({id:tokenArry[data.data.tk].user.id},{$set:moneySet},{},function(errA){
						if(errA){
							console.log(errA);
							result.success=false;
							result.message="扣费错误";
							returnFn();
						}else{
							data_mg.deal.update({id:data.data.id},{$set:{state:1,"dealName":data.data.dealName,
								"dealPhone":data.data.dealPhone,
								"dealPlace":data.data.dealPlace}},{},function(errDeal){
								if(errDeal){
									console.log(errDeal)
									result.success=false;
									result.message="订单状态修改错误";
									returnFn();
								}else{
									result.success=true;
									result.code=1;
									returnFn();
								}
							});
						}
					});
				}else{
						console.log("余额不足");
						result.success=false;
						result.message="余额不足";
						returnFn();
					}
						}
					});
				}else{
					console.log("订单状态不正确");
					result.success=false;
					result.message="订单状态不正确";
					returnFn();
				}
			}
		});
	}else{
		result.success=false;
		result.message="登陆信息超时";
		returnFn();
	}
}
/*****************************************************************************************************/
function send(socket,data,fn){
	console.log("deal/send");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_send",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		if(data.data.logistics&&data.data.logNumber){
			data_mg.deal.findOne({id:data.data.id,shopId:tokenArry[data.data.tk].user.id},function(dealErr,deal){
				if(dealErr){
					console.log(dealErr)
					result.success=false;
					result.message="该订单不存在";
					returnFn();
				}else{
					if(deal.state==1){
						data_mg.deal.update({id:data.data.id,shopId:tokenArry[data.data.tk].user.id},{$set:{logistics:data.data.logistics,logNumber:data.data.logNumber,state:2}},{},function(errDeal){
							if(errDeal){
								console.log(errDeal)
								result.success=false;
								result.message="修改订单状态错误";
								returnFn();
							}else{
								result.success=true;
								result.code=1;
								returnFn();
							}
				});
					}else{
						console.log("状态错误")
						result.success=false;
						result.message="该订单状态错误";
						returnFn();
					}
				}
			});		
		}else{
			console.log("快递信息不全")
			result.success=false;
			result.message="快递信息不全";
			returnFn();
		}
	}else{
		console.log("登陆信息超时")
		result.success=false;
		result.message="登陆信息超时";
		returnFn();
	}
}
/*****************************************************************************************************/
function confirm(socket,data,fn){
	console.log("deal/confirm");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_confirm",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.deal.findOne({id:data.data.id,userId:tokenArry[data.data.tk].user.id},function(dealErr,deal){
			if(dealErr){
				console.log(dealErr)
				result.success=false;
				result.message="该订单不存在";
				returnFn();
			}else{
				if(deal.state==2){
					data_mg.client_password.findOne({"parentKey":tokenArry[data.data.tk].user.id,
		"childKey":data.data.password},function(passErr){
						if(passErr){
							console.log(passErr)
							result.success=false;
							result.message="密码错误";
							returnFn();
						}else{
							data_mg.deal.update({id:data.data.id,userId:tokenArry[data.data.tk].user.id},{$set:{state:3}},{},function(stateErr){
								if(stateErr){
									console.log(stateErr);
									result.success=false;
									result.message="更改订单状态失败";
									returnFn();
								}else{
									data_mg.client.update({id:deal.shopId},{$inc:{balance:deal.totalPrice}},{},function(shopErr){
										if(shopErr){
											console.log(shopErr);
											result.success=false;
											result.message="打款失败";
											returnFn();
										}else{
											result.success=true;
											result.code=1;
											returnFn();
										}
									});
								}
							});
						}
					});
				}else{
					result.success=false;
					result.message="订单状态不正确";
					returnFn();
				}
			}
		});
	}else{
		console.log("登陆信息超时")
		result.success=false;
		result.message="登陆信息超时";
		returnFn();
	}
}
/*****************************************************************************************************/
function evaluate(socket,data,fn){
	console.log("deal/evaluate");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_evaluate",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.deal.findOne({id:data.data.id,userId:tokenArry[data.data.tk].user.id},function(dealErr,deal){
			if(dealErr){
				console.log(dealErr)
				result.success=false;
				result.message="该订单不存在";
				returnFn();
			}else{
				if(deal.state==3){
					data_mg.deal.update({id:data.data.id,userId:tokenArry[data.data.tk].user.id},{$set:{state:4,star:data.data.star||0,com:data.data.com||"",comTime:new Date().getTime()}},{},function(evalErr){
						if(evalErr){
							console.log(evalErr);
							result.success=false;
							result.message="提交评价失败";
							returnFn();
						}else{
							data_mg.client.update({id:deal.shopId},{$inc:{star:data.data.star||0}},{},function(shopErr){
								if(shopErr){
								console.log(shopErr);
								result.success=false;
								result.message="修改商家积分失败";
								returnFn();	
							}else{
								result.success=true;
								result.code=1;
								returnFn();	
							}
								
							});
						}
					});
				}else{
					result.success=false;
					result.message="订单状态不正确";
					returnFn();
				}
			}
		});
	}else{
		console.log("登陆信息超时")
		result.success=false;
		result.message="登陆信息超时";
		returnFn();
	}
}
/*****************************************************************************************************/
function back(socket,data,fn){
	console.log("deal/back");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_back",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.deal.findOne({id:data.data.id,userId:tokenArry[data.data.tk].user.id},function(dealErr,deal){
			if(dealErr){
				console.log(dealErr)
				result.success=false;
				result.message="该订单不存在";
				returnFn();
			}else{
				if(deal.state==1||deal.state==2){
					data_mg.deal.update({id:data.data.id,userId:tokenArry[data.data.tk].user.id},{$set:{state:6}},{},function(backErr){
						if(backErr){
							console.log(backErr);
							result.success=false;
							result.message="修改订单状态错误";
							returnFn();
						}else{
							result.success=true;
							result.code=1;
							returnFn();
						}
					})
				}else{
					result.success=false;
					result.message="该订单状态错误";
					returnFn();
				}
			}
	})
	}
}
/*****************************************************************************************************/
function backPay(socket,data,fn){
	console.log("deal/backPay");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_backPay",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		data_mg.deal.findOne({id:data.data.id,shopId:tokenArry[data.data.tk].user.id},function(dealErr,deal){
			if(dealErr){
				console.log(dealErr)
				result.success=false;
				result.message="该订单不存在";
				returnFn();
			}else{
				if(deal.state==6){
					data_mg.deal.update({id:data.data.id,shopId:tokenArry[data.data.tk].user.id},{$set:{state:5}},{},function(backErr){
						if(backErr){
							console.log(backErr);
							result.success=false;
							result.message="更改订单状态失败";
							returnFn();
						}else{
							data_mg.client.update({id:deal.userId},{$inc:{balance:deal.totalPrice}},{},function(clientErr){
								if(clientErr){
									console.log(clientErr)
									result.success=false;
									result.message="退款失败";
									returnFn();
								}else{
									data_mg.updateTime.update({"parentKey":"client"},{$set:{"childKey":new Date().getTime()}},{},function(timeErr){
										if(timeErr){
											console.log(timeErr);
											result.success=false;
											result.message="更新用户时间失败";
											returnFn();
										}else{
											result.success=true;
											result.code=1;
											returnFn();
										}
									});
								}
							})
						}
					})
				}else{
					result.success=false;
					result.message="该订单状态错误";
					returnFn();
				}
			}
	})
	}
}
/*****************************************************************************************************/
function list(socket,data,fn){//订单列表
	console.log("deal/list");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_list",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
			data_mg.deal.find({userId:tokenArry[data.data.tk].user.id},function(err,doc){
			if(err){
				console.log(err)
				result.success=false;
				result.message("获取交易列表失败")
				}else{
					result.success=true;
					result.data=doc;
					result.code=1
					}
			returnFn();		
			})
			}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}
		
};
/*****************************************************************************************************/
function shopList(socket,data,fn){//订单列表
	console.log("deal/shopList");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_shopList",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.type==3){
			data_mg.deal.find({shopId:tokenArry[data.data.tk].user.id},function(err,doc){
			if(err){
				console.log(err)
				result.success=false;
				result.message("获取交易列表失败")
				}else{
					result.success=true;
					result.data=doc;
					result.code=1
					}
			returnFn();		
			})
			}else{
				result.success=false;
				result.message="登陆信息超时或不是卖家帐号";
				returnFn();
				}
		
};
exports.get=get;
exports.add=add;
exports.cancel=cancel;
exports.pay=pay;
exports.send=send;
exports.confirm=confirm;
exports.evaluate=evaluate;
exports.back=back;
exports.backPay=backPay;
exports.list=list;
exports.shopList=shopList;
