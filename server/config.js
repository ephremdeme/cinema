var express         =require("express"),
    routes          =require("./routes"),
    path            =require("path"),
    bodyparser      =require("body-parser"),
    morgan          =require("morgan"),
    moment          =require("moment"),
    methodoverride  =require("method-override"),
    ejs             =require("ejs"),
    cookieparser    =require("cookie-parser"),
    errorhandler    =require("errorhandler");

module.exports= function(app){

    app.set("view engine", "ejs");
    app.use(morgan("dev"));
    app.use(methodoverride("_method"));
    app.use(bodyparser.urlencoded({extended: true})); 
    app.use(cookieparser("ephrem"));

    //app.use("/", routes);
    app.use("/public/", express.static(path.join(__dirname, "../public")));
    app.use(express.static( "public"));
    
    return app;
}
