'use strict';
module.exports = (express, app)=>{
	let router = express.Router();
	router.get('/', (req,res,next)=>{
		res.render('index', {'title': "Welcome to ChitChat Cat Chat."});
	});
	router.get('/chatrooms', (req,res,next)=>{
		res.render('chatrooms', {'title': "Chitty Chitty Chatcat."});
	});
	router.get('/setValue', (req,res,next)=>{
		req.session.newValue = "Star Wars";
		res.send("A new value was set.");
	});
	router.get('/setColor', (req,res,next)=>{
		req.session.favColor = "Red";
		res.send("Setting fav color to Red.");
	});
	router.get('/getColor', (req,res,next)=>{
		res.send("Favorite color is " + req.session.favColor===undefined?"NOT SET!" : req.session.favColor);
	});

	app.use('/', router);
};
