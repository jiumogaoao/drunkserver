var express={}
express.addShoppingCart=function(socket,data){
	data_mg.user.findOne({_id:socket.userId},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取用户信息错误"});
		}else{
			doc.shoppingCart=_.uniq(doc.shoppingCart.push({_id:data._id,shop:data.shop}));
			doc.save(function(errA,docA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新用户信息错误"});
				}else{
					socket.emit("addShoppingCart",data);
				}
			});
		}
	});
}
express.removeShoppingCart=function(socket,data){
	data_mg.user.findOne({_id:socket.userId},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取用户信息错误"});
		}else{
			doc.shoppingCart=_.without(doc.shoppingCart,{_id:data._id});
			doc.save(function(errA,docA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新用户信息错误"});
				}else{
					socket.emit("removeShoppingCart",data);
				}
			});
		}
	});
}
express.add=function(socket,data){
	var total=0;
	_.each(data.goodList,function(n){
		total+=n.price*n.count;
	});
	var newExpress=new data_mg.express({user:socket.userId,
	goodList:data.goodList,
	state:0,
	stateList:[],
	expressCompany:"",
	expressID:"",
	total:total,
	shop:data.goodList[0].shop,
	provinceID:data.provinceID,
	cityID:data.cityID,
	place:data.place,
	phone:data.phone,
	name:data.name,
	updataTime:[new Date().getTime()]});
	newExpress.save(function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"生成订单错误"});
		}else{
			socket.emit("buyAdd",doc);
			
				if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
					loginArry["ID_"+doc.shop].socket.emit("sellAdd",doc);
				}
			
		}
	});
}
express.pay=function(socket,data){
	function changeDoc(user,doc){
		doc.state=1;
		doc.stateList.push("买家已支付，等待卖家发货");
		doc.updataTime.push(new Date().getTime());
		doc.save(function(err){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"更改订单状态错误"});
			}else{
				socket.emit("pay",doc);
				socket.emit("balance",user.balance);
		
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
						loginArry["ID_"+doc.shop].socket.emit("sellPay",doc);
					}
			
			}
		});
	}
	function subBalance(user,doc){
		user.balance-=doc.total;
				user.save(function(err,docA){
					if(err){
						console.log(err);
						socket.emit("err",{errDsc:"扣费错误"});
					}else{
						changeDoc(user,doc);
					}
				});
	}
	function findExpress(user){
		data_mg.express.findOne({_id:data._id},function(err,doc){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"获取订单信息错误"});
			}else if(user.balance<doc.total){
				socket.emit("err",{errDsc:"余额不足"});
			}else{
				subBalance(user,doc)
			}
		});
	}
	data_mg.user.findOne({_id:socket.userId},function(err,user){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取用户信息错误"});
		}else{
			findExpress(user);
		}
	});
}
express.send=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=2;
			doc.stateList.push("卖家已发货，等待快递员揽件");
			doc.expressCompany=data.expressCompany;
			doc.expressID=data.expressID;
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					socket.emit("expressSend",doc);
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressSend",doc);
					}
				}
			})
		}
	})
}
express.pick=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=3;
			doc.stateList.push("快递员已揽件，请注意查收");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressPick",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
						loginArry["ID_"+doc.shop].socket.emit("expressPick",doc);
					}
				}
			})
		}
	})
}
express.arrive=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=4;
			doc.stateList.push("快递已签收，请确认收货");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
						loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
					}
				}
			})
		}
	})
}
express.check=function(socket,data){
	function payMoney(doc){
		data_mg.user.update({_id:data.shop},{$inc:{balance:data.total}},function(err){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"打款错误"});
			}else{
				if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
				}
				if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
						loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
				}
			}
		});
	}
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=5;
			doc.stateList.push("买家已收货，交易完成");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					payMoney(doc);
				}
			})
		}
	})
}
express.back=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=6;
			doc.stateList.push("买家申请退货，待确认");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
							loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
					}
				}
			})
		}
	})
}
express.backCheck=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=7;
			doc.stateList.push("卖家确认退货，请尽快联系快递");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
							loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
					}
				}
			})
		}
	})
}
express.backSend=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=8;
			doc.stateList.push("退货已发出，请尽快确认");
			doc.expressCompany=data.expressCompany;
			doc.expressID=data.expressID;
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
							loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
					}
				}
			})
		}
	})
}
express.backSuccess=function(socket,data){
	function moneyBack(doc){
		data_mg.user.undate({_id:doc.user},{$inc:{balance:data.total}},function(err){
			if(err){
				console.log(err);
				socket.emit("err",{errDsc:"退款错误"});
			}else{
				if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
				}
				if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
						loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
				}
			}
		});
	}
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=9;
			doc.stateList.push("退货成功，已退款");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					moneyBack(doc);
					
				}
			})
		}
	})
}
express.cancel=function(socket,data){
	data_mg.express.findOne({_id:data._id},function(err,doc){
		if(err){
			console.log(err);
			socket.emit("err",{errDsc:"获取订单信息错误"});
		}else{
			doc.state=10;
			doc.stateList.push("订单已取消");
			doc.updataTime.push(new Date().getTime());
			doc.save(function(errA){
				if(errA){
					console.log(errA);
					socket.emit("err",{errDsc:"更新订单信息错误"});
				}else{
					if(loginArry["ID_"+doc.user]&&loginArry["ID_"+doc.user].socket){
						loginArry["ID_"+doc.user].socket.emit("expressArrive",doc);
					}
					if(loginArry["ID_"+doc.shop]&&loginArry["ID_"+doc.shop].socket){
							loginArry["ID_"+doc.shop].socket.emit("expressArrive",doc);
					}
				}
			})
		}
	})
}
module.exports=express;