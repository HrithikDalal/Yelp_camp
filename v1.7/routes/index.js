var express = require("express");
var router = express.Router(),
    passport = require("passport"),
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
    User.register(new User({username:req.body.username}), req.body.password, function(err,user){
        if(err)
        {
            console.log(err);
            res.render("register");
        }
            passport.authenticate("local")(req,res,function(){
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
//middleware   
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRediretc:"/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;