'use strict';

module.exports = (express, app, passport, config, rooms)=>{
	let router = express.Router();
	router.get('/', (req,res,next)=>{
		res.render('index', {'title': "Welcome to ChitChat Cat Chat."});
	});
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/chatrooms',
		failureRedirect: '/'
		})
	);

	function securePages(req, res, next) {
		if (req.isAuthenticated()){
			next();
		} else {
			res.redirect('/');
		}
	}
	function findTitle(room_id){
		var name = "";
		for(var room in rooms) {
			if(room_id == room.room_id){
				name = room.room_name;
			}
		}
		return name;
	};

	router.get('/room/:id', securePages, (req, res, next)=>{
		var room_name = findTitle(req.params.id);
		res.render('room', {user: req.user, room_number:req.params.id, config:config, room_name: room_name});

	});
	router.get('/chatrooms', securePages, (req,res,next)=>{
		res.render('chatrooms', {'title': "Chitty Chitty Chatcat.", user: req.user, config:config});
	});

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
};
