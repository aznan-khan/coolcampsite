var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var flash = require("connect-flash")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var User = require("./models/user")
var Campground = require("./models/campground")
var Comment = require("./models/comments")
var methodOverride = require("method-override")

var authRoutes 			= require("./routes/auth"),
 	commentRoutes 		= require("./routes/comments"),
 	campgroundRoutes 	= require("./routes/campgrounds")


var seedDB = require("./seed")
// mongoose.connect('mongodb://localhost:27017/yelp_camp2');
mongoose.connect("mongodb+srv://Aznan:Aznan@1234@cluster0-vryyw.mongodb.net/yelpcamp?retryWrites=true&w=majority");

 // seedDB()

// Campground.create({
// 	name: "Abric Hill",
// 	image: "https://pixabay.com/get/57e8d7414e5aa814f1dc84609620367d1c3ed9e04e507441722d72d1954fc2_340.jpg",
// 	description: "The hill is a very soothing place when one can come to relive their stress and can breathe in a healthy atmosphere"
// }, function(err, Campground) {
// 	if(err) {
// 		console.log(err)
// 	}
// 	else
// 		console.log("Added to DataBase")
// })


// PASSPORT CONFIGURATIONS
app.use(require("express-session")({
	secret: "Fav is SRK",
	resave: false,
	saveUninitialized: false
}));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	res.locals.success = req.flash("success")
	res.locals.error = req.flash("error")
	next()
})
app.get("/", function(req, res) {
	res.render("landing")
})
app.use( authRoutes)
app.use(commentRoutes)
app.use(campgroundRoutes)

	
app.listen(3001, function() {
	console.log("YelpCamp has started !!!")
})