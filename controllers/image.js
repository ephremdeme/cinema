
var moment      =require("moment");
var con =require("../con");

module.exports = {
    index : function(req, res){
        con.query("SELECT * FROM `images` WHERE id=?", req.params.id, function(err, results, fields){
            if(err){
                console.log(err)
            }
            var im={
                id: results[0].id,
                image: results[0].image,
                name : results[0].name,
                timestamp: moment(results[0].timestamp).startOf("minute").fromNow(),
                description: results[0].description,
                
            };
            console.log(results[0].timestamp +"\n");
            console.log(moment(results[0].timestamp).startOf("minutes").fromNow())
            con.query("select * from comment where images_id=?", im.id, function(err, results, field){
                if(err) console.log(err);
                console.log(results +"from comment");
                console.log(im);
                var com=[];

                for(var i=0; i<results.length; i++){
                    var t={
                        comment: results[i].comment,
                        timestamp: moment(results[i].timestamp).startOf("minute").fromNow()
                    }
                    com.push(t);
                }
                console.log(im)
                res.render("show.ejs", {movies : im, comment:com});
            })  
        })   
    },
    create : function(req, res){
        var user1 = req.user;
        var name = req.body.name;
        var image = req.body.image;
        var desc = req.body.description;
        var newmovies = {name: name, image: image, description: desc};
        con.query("INSERT INTO images (name, image, description, users_id) VALUES (?, ?, ?, ?)", [newmovies.name, newmovies.image,newmovies.description, user1.id], function(err, results, fields){
            if(err){
                console.log(err+"form insert");
            }else{
                
                console.log(results.timestamp+ "from rows");
                res.redirect("/")
            }
            
        });
        
    } ,
    like : function(req, res) {
        res.send("image like controller is here");
    },
    comment : function(req, res) {
        res.send("image comment controller is here");
    }
}