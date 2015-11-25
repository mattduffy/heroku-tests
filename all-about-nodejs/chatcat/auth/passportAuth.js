'use strict';

module.exports = (passport, FacebookStrategy, config, mongoose)=>{

  var chatUser = new mongoose.Schema({
    profileID: String,
    fullName: String,
    profilePic: String
  });
  var userModel = mongoose.model('chatUser', chatUser);

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
      userModel.findById(id, function(err, user){
        done(null, user);
      });
  });

  passport.use(new FacebookStrategy({
    clientID: config.fb.appId,
    clientSecret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    profileFields: ['id', 'displayName', 'photos']
  }, (accessToken, refreshToken, profile, done)=>{
    // Check if user exists in our mongodb
    // if not, create new user and return profile
    // if user exists, simply return profile.
    userModel.findOne({'profileID': profile.id}, function(err, result){
      if (result){
        done(null, result);
      } else {
        // create user in mongodb
        var newChatUser = new userModel({
          profileID: profile.id,
          fullName: profile.displayName,
          profilePic: profile.photos[0].value || ''
        });
        newChatUser.save(function(err){
          done(null, newChatUser);
        });

      }
    })
  }))
};
