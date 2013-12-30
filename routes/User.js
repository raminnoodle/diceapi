exports.register = function(req, res) {
	var u = require('utils');
	var username = req.body.username;
	var password = req.body.password;
	var alias = req.body.alias;
	var coin = req.headers.coin;

	if ((!u.isValid(username)) || (!u.isValid(password)))
	{
		res.send({result:"ERROR",msg:"The arguments supplied were invalide. Either your username or password needs to be changed."});
	}else{

		var q = "select * from users where username = '" + username + "'";

		u.sqlQuery(q,function(r){
			if (!r){
				var q = "insert into users set username = '" + username + "', password ='" + password + "'";
				u.sqlQuery(q,function(r){
					q = "select id from users where username = '" + username + "' and password='" +password+ "'";
					u.sqlQuery(q,function(r2){
						if (!r2){
							res.send({result:"ERROR",msg:"Bad username or password"});
						}else{
							u.addSession(coin,r2.id,alias,function(){
								u.getSession(coin,alias,function(sdata){
									res.send(sdata);
								});
							});
						}
					});
				});
			}else{
				res.send({result:"ERROR",msg:"An account with that username already exists."});
			}
		});
	}
};

exports.getBets = function(req, res) {
	var u = require('utils');
	var user  = req.params.user;

	u.debug("-getBets " + user);
	u.getBets(user,function(sdata){
		res.send(sdata);
	});

};

exports.identify = function(req, res) {
	var u = require('utils');
	var username = req.body.username;
	var password = req.body.password;
	var alias  = req.body.alias;
	var coin = req.headers.coin;
	console.log(req.body);

	if ((!u.isValid(username)) || (!u.isValid(password)) || (!u.isValid(alias)))
		res.send({result:"ERROR",msg:"Error happened please contact Raminnoodle error u101"});
	
	var q = "select id from users where username = '" + username + "' and password='" +password+ "'";
	u.sqlQuery(q,function(r){
		if (!r){
			res.send({result:"ERROR",msg:"Bad username or password"});
		}else{
			u.addSession(coin,r.id,alias,function(){
				u.getSession(coin,alias,function(sdata){
					res.send(sdata);
				});
			});

			//res.send({result:"SUCCESS", msg:"You are now authorized to play.",server_seed:r2.server_seed,client_seed:r2.client_seed,chance:r2.chance});
		}
	});
};

exports.getSession = function(req, res) {
	var u = require('utils');
	var alias  = req.body.alias;
  	var coin = req.headers.coin;
	u.debug("-getInfo " + alias);
	u.getSession(coin,alias,function(sdata){
		if (!sdata){
			u.debug("-getInfo ERROR NOT AUTHORIZED");
			res.send({result:"ERROR", msg:"NOT AUTHORIZED"});
		}else{
			u.debug("-getInfo SUCCESS " + sdata);
			res.send(sdata);
		}
	});

};

exports.setClientSeed = function(req, res) {
	var u = require('utils');
	var alias  = req.body.alias;
	var seed = req.body.seed;
  	var coin = req.headers.coin;

	u.debug("CHANGING SEED: " + alias + " - " + seed);
	u.getSession(coin,alias,function(sdata){
	 
		if (!sdata){
			res.send({result:"ERROR", msg:"NOT AUTHORIZED"});
		}else{
			u.setClientSeed(coin,alias,seed,function(rdata){
				if (rdata.result != "ERROR"){
					u.getSession(coin,alias,function(sdata){
						res.send(sdata);
					});
				}else{
					res.send(rdata);
				}
			});
		}
	});
};


exports.setMultiplier = function(req, res) {
	var u = require('utils');
	var alias  = req.body.alias;
	var multiplier = req.body.multiplier;
  	var coin = req.headers.coin;

	u.debug("CHANGING Multiplier: " + alias + " - " + multiplier);
	u.getSession(coin,alias,function(sdata){
	 
		if (!sdata){
			res.send({result:"ERROR", msg:"NOT AUTHORIZED"});
		}else{
			u.setMultiplier(coin,alias,multiplier,function(rdata){
				if (rdata.result != "ERROR"){
					u.getSession(coin,alias,function(sdata){
						res.send(sdata);
					});
				}else{
					res.send(rdata);
				}
			});
		}
	});
};


exports.test = function(req, res) {
	var config = require('config');
	  	var coin = req.headers.coin;
	res.send(config.coin[coin].wallet.host);
};
