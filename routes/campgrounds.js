var express = require("express")
router = express.Router({mergeParms: true})
var Campground = require("../models/campground")
var middleware = require("../middleware")

router.get("/campground", function(req, res) {
	Campground.find({}, function(err, allCampground) {
	if(err) {
		console.log(err)
	}
	else {
		// console.log(Campground)
		res.render("campground", {campgrounds: allCampground})
	}
	})
})

router.post("/campground", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name
	var image = req.body.image
	var price = req.body.price
	var desc = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name, image: image, price: price, description: desc, creator: author}
	
//	campground.push(newCamp)
	Campground.create(newCamp, function(err, newcamp) {
		if(err) {
			console.log(err)
		}
		//  else {
		// 	console.log(newcamp)
		// }
	})
	req.flash("success", "Campground successfully created.")
	res.redirect("/campground")
})
router.get("/campground/new", middleware.isLoggedIn, function(req, res) {
	res.render("newCampground")
})
router.get("/campground/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err)
		} else {
			res.render("show", {campground: foundCampground})
		}
	})
})

router.get("/campground/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("edit", {campground: foundCampground})
			})
	})
router.put("/campground/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updateCampground ) {
		if(err) {
			res.redirect("/campground")
		} else {
			req.flash("success", "Successfully updated Campground.")
			res.redirect("/campground/" + req.params.id)
		}
	})
})

router.delete("/campground/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			res.redirect("/campground/" + req.params.id)
		} else {
			campground.remove()
			req.flash("success", "Successfully Deleted the Campground.")
			res.redirect("/campground")
		}
	})
})

module.exports = router

