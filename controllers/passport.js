var localstrategy       =require("passport-local"),
    mysql               =require("mysql"),
    bcrypt              =require("bcrypt-nodejs"),
    con                 =require("../con");

con.connect();
module.exports = function(passport){
    
    // user session setup
    passport.serializeUser( function( user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        con.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows){
            done(err, rows[0]);
        });
    });

    //user local sign up

    passport.use(
        'local-signup',
        new localstrategy({
            usernameField:"username",
            passwordField: "password",
            passReqToCallback : true
        },
        function(req, username, password, done){
            con.query("SELECT * FROM users WHERE username= ?", [username], function(err, rows){
                if(err) return done(err);
                if(rows.length){
                    return done(null, false, req.flash("signupMessage", "username already taken!"));
                }else{
                    var newUser={
                        username:username,
                        password: bcrypt.hashSync(password, null, null)
                    };
                    con.query("INSERT INTO users (username, password) values (?, ?)", [newUser.username, newUser.password], function(err, rows){
                        if(err){
                            console.log(err+"form insert");
                        }
                        newUser.id= rows.insertId;
                        
                        return done(null, newUser);
                        
                    });
                }
            });
        })
    );

    // local user login

    passport.use(
        'local-login',
        new localstrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            con.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows, field){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password)){

                    
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata


                }

                console.log(rows[0].type + "type")
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
}