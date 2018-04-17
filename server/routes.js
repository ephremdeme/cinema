
var  moment          =require("moment");
var home = require('../controllers/home'),
image = require('../controllers/image');

// app/routes.js
var con =require("../con");
//con.connect();
module.exports = function(app, passport) {

    app.use( function(req, res, next){
        res.locals.currentUser=req.user;
        next();
    })
    
        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get("/",   home.index)
        
        
        var d=Date.now();
        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {
            console.log(Date.now());
            var mon=moment(d).startOf("minutes").fromNow();
            console.log(moment(d).startOf("minute").fromNow());

            //console.log({messagetype})
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
    
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }),
            function(req, res) {
                console.log("hello");
    
                if (req.body.remember) {
                  req.session.cookie.maxAge = 1000 * 60 * 3;
                } else {
                  req.session.cookie.expires = false;
                }
            res.redirect('/');
        });
    
        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
    
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
        // =====================================
        // Add movies  SECTION  =========================
        // =====================================
        
        

        app.get("/images/addmovie", isLoggedIn, function(req, res){
            
            res.render("new.ejs");
        })

        app.post("/images/addmovie", isLoggedIn, image.create );


        app.get("/images/:id", isLoggedIn, image.index);
        app.get("/images/:id/comment", isLoggedIn,  function(req,res){
             con.query("SELECT * FROM `images` WHERE id=?", req.params.id, function(err, results, fields){
            if(err){
                console.log(err)
            }
            var im={
                id: req.params.id,
                image: results[0].image,
                name : results[0].name,
                description: results[0].description
            };
            console.log(im +"from im");
            res.render("comment.ejs", {movies : im});
        })
        });
        app.post("/images/:id/comment", isLoggedIn, function(req, res){
            var comment={
                comment: req.body.comment,
                images_users_id: req.params.id,
                id:req.user.id
            }
            console.log(comment.comment+ "\n"+ req.body.comment)
            console.log(comment+ "from comment")
            con.query("INSERT INTO comment (comment, id, images_users_id, images_id ) VALUES (?, ?,?, ?)", [comment.comment, comment.id , comment.id,  comment.images_users_id ], function(err, rows, fields){
                if(err){
                    console.log(err+"form insert");
                }else{
                    console.log(rows+"from rows");
                    res.redirect("/images/"+ comment.images_users_id);
                }
                
            });
        })

        // app.get("/images/:id/comment", function(req, res){
        //     console.log(req.params.id + "id from comment")
        //     res.send("hello comment")
        // })
        // =====================================
        // PROFILE SECTION =========================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            var user1 = req.user;
            console.log(user1);
            if(user1.type ==="admin"){
                res.send("welcome admin")
            }else{
                res.render('profile.ejs', {
                    user : req.user // get the user out of session and pass to template
                });
            }
            
        });
    
        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
        
        
    };
    
    // route middleware to make sure
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()){
            
            return next();
        }
            
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
    