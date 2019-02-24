
var express = require("express");
var app = express();
var mongoose=require("mongoose");
var Campground=require("./models/campground");
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
            res.render("Index",{campgrounds : campgrounds});
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
    res.render("new");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
            console.log(err);
        }else{
            res.render("show",{campground : foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp server has Started!");
});