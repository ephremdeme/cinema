var express             =require("express"),
    config              =require("./server/config"),
    path                =require("path"),
    flash               =require("connect-flash"),
    session             =require("express-session"),
    jroutes             =require("./server/routes"),
    passport            = require('passport');


var app=express();
require('./controllers/passport')(passport);

app.set('views', __dirname + '/views');
app=config(app);
app.set('views', __dirname + '/views');
app.set("view engine", "ejs")

app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var routes =  require('./server/routes.js')(app, passport);
//app.use("/", routes);
app.listen(3000, function(){
    console.log("server started....");
});
