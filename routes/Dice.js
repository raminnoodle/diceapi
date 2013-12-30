
exports.roll = function(req, res) {
	var u = require('utils');

    var alias = req.body.alias;
	var amount = req.body.amount;
  	var pick = req.body.pick;
  	var coin = req.headers.coin;

  	u.getSession(coin,alias,function(sdata){
		if (!sdata){
			    res.send({result:"ERROR", msg:"NOT AUTHORIZED"});
			}else{
			u.rollDice(coin,sdata,alias,amount,pick,function(r){
				res.send(r);
			});
		}
    });
};

