var Campground = require("../models/campground")
var Comment = require("../models/comments")

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err) {
				res.redirect("/campground")
			} else {
				if(foundCampground.creator.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that.")
					res.redirect("back")
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that.")
		res.redirect("back")
	}
}
	
middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				req.flash("err", "Something went wrong")
				res.redirect("/campground")
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that.")
					res.redirect("back")
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that.")
		res.redirect("back")
	}
}
	
middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next()
	}
	req.flash("error", "You need to be logged in to do that.")
	res.redirect("/login")
}

middlewareObj.isPaid = function(req, res, next) {
	if (req.user.isPaid)	return next();
	
	req.flash("error", "Please pay the registration fee before continuing.")
	res.redirect("/checkout")
}

module.exports = middlewareObj