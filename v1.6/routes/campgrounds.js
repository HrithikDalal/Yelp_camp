var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/",function(req,res){
    Campground.find({},function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/Index",{campgrounds : campgrounds, currentUser: req.user});
        }
    });
});

router.post("/",isLoggedIn,function(req,res){
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

//Add new Campground

router.get("/new",isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground : foundCampground});
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;