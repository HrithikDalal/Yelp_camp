
var express = require("express");
var app = express();

app.set("view engine","ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds= [
        {name: "Salmon Creek", image:"https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Granite Hill", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Yin Top", image:"https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"},
        {name: "Salmon Creek", image:"https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Granite Hill", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Yin Top", image:"https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"},
        {name: "Salmon Creek", image:"https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Granite Hill", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f7c17fa0eeb0bf_340.jpg"},
        {name: "Yin Top", image:"https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"}
    ] ;

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds : campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image : image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
    
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp server has Started!");
});