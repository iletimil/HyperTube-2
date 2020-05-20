const LocalStrategy = require('passport-local').Strategy;
const User =  require('../models/users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

module.exports = function(passport){
    // local user authentiofication
    passport.use('local', new LocalStrategy(function(username, password, done){
        let query = {username:username};
        User.findOne(query, function(err, user){
            if (err)
            {
                console.log('error 01');
                return done(err);
            }
            if(!user)
                return done(null, false, {message: 'User not found'});
            
            bcrypt.compare(password, user.password, function(err, isMatch){
                if (err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Incorrect password'});
                }
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({usernameField : 'username',passwordField : 'email', passReqToCallback: true}, function(req, username, email, done, res){
        let query = {username:username};
        User.findOne(query, function(err, user){
            if (err)
                return done(err);
            if(user)
                return done(null, false, {message: 'Username already exists'});
            else{
                let query = {email:email};
                User.findOne(query, function(err, mail){
                    if (err) return done(err);
                    if (mail)
                        return done(null, false, {message: 'Email already exists'});
                    else{
                        let newUser = new User();
                        newUser.firstname = req.body.firstname;
                        newUser.lastname = req.body.lastname;
                        newUser.username = req.body.username;
                        newUser.email = req.body.email;
                        newUser.password = req.body.password;

                        bcrypt.genSalt(10, function(err, salt){
                            bcrypt.hash(newUser.password, salt, function(err, hash){
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.save(function(err){
                                    if (err) throw err;
                                    else{
                                        req.flash('success', "User registered");
                                        return done(null, newUser);
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    }));
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

}