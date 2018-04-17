var con   =require("../con");
module.exports = {
    index : function(req, res){
        if(req.isAuthenticated()){
            con.query("select * from images", function(err, results, fields){
                //console.log(results.length +"results" +"\n");

                //console.log(fields[1] + "fields");
                res.render("home.ejs", {movies: results});
            });
        }else{
            res.render("index.ejs");
        }
      
    }
}
