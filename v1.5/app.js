var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    seedDB                = require("./seeds"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user");


mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();

 
//PASSPORT CONFIGURATION
 
app.use(require("express-session")({
    secret:"This is my secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser= req.user;
   next();
});

//=====================   
//ROUTES
//=====================

//HOME
app.get("/",function(req,res){
    res.render("landing");
});

//INDEX- show all campgrounds

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/Index",{campgrounds : campgrounds, currentUser: req.user});
        }
    });
});

app.post("/campgrounds",isLoggedIn,function(req,res){
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

app.get("/campgrounds/new",isLoggedIn, function(req,res){
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
             res.render("comments/new",{campground:campground});
        }
    });
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

//=================
//AUTH ROUTES
//=================

//Show sign up form
app.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up
app.post("/register",function(req,res){
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
app.get("/login",function(req,res){
    res.render("login");
});

//handling user login
//middleware   
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRediretc:"/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp server has Started!");
});