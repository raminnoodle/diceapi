var express = require('express'),
    Dice = require('./routes/Dice'),
    User = require('./routes/User'),
	config = require('config');

var app = express();

app.use(express.bodyParser());

app.post('/dice/roll', Dice.roll);

app.post('/user/register', User.register);
app.post('/user/identify', User.identify);
app.post('/user/seed', User.setClientSeed);
app.post('/user/multiplier', User.setMultiplier);
app.post('/user/session', User.getSession);
app.get('/user/bets/:user', User.getBets);


app.get('/wallet/:user', User.test);
//app.get('/wallet/:alias', User.getWallet);
//app.get('/seeds', Dice.getSeeds); 
//app.get('/multiplyer/:multiplyer',Dice.getMultiplyer);

app.listen(config.port,config.ip);
console.log('Listening on port ' + config.port);