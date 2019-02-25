require("dotenv").config();
var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    seedDB                = require("./seeds"),
    methodOverride        = require("method-override"),
    Campground            = require("./models/campground"),
    expressSanitizer      = require("express-sanitizer"),
    Comment               = require("./models/comment"),
    flash                 =require("connect-flash"),
    User                  = require("./models/user");

var commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
console.log(process.env.DATABASEURL);

mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
//seedDB();

app.locals.moment = require('moment');
 
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
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);



app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp server has Started!");
});