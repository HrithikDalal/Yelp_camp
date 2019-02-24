var express = require("express");
var router = express.Router(),
    passport = require("passport"),
    Campground = require("../models/campground"),
    User     = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
});


//Show sign up form
router.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up
router.post("/register",function(req,res){
    var newUser = new User(
        {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email :req.body.email,
            avatar: req.body.avatar,
            username: req.body.username,
        });
    User.register(newUser, req.body.password, function(err,user){
        if(err)
        {
            req.flash("error",err.message);
            return res.render("register");
        }
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
    });
});

//LoginRoutes
//render login form
router.get("/login",function(req,res){
    res.render("login");
});

//handling user login
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRediretc:"/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","Logged you out!");
   res.redirect("/");
});

//USER PROFILE

router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err, foundUser){
        if(err)
        {
        req.flash("error","Something went wrong.")
        res.redirect("/");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err,campgrounds){
           if(err)
        {
        req.flash("error","Something went wrong.")
        res.redirect("/");
        }
           res.render("users/show",{user: foundUser, campgrounds:campgrounds}); 
        });
        
    });
});


module.exports = router;