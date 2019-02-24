
var express = require("express");
var app = express();
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var seedDB= require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

app.set("view engine","ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/Index",{campgrounds : campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var discription= req.body.discription;
    var newCampground = {name: name, image : image, discription : discription};
    Campground.create(newCampground,function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
        });
});

app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground : foundCampground});
        }
    });
});

//=================================
//COMMENTS
//=================================

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
             res.render("comments/new",{campground:campground});
        }
    });
})

app.post("/campgrounds/:id/comments",function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
          res.redirect("/campgrounds");
       }else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }
               else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
           })
       }
   }) ;
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp server has Started!");
});