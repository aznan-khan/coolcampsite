var express = require("express")
router = express.Router({mergeParams: true})
var Campground = require("../models/campground")
var Comment = require("../models/comments")
var middleware = require("../middleware")
var { isLoggedIn, isPaid, checkCommentOwnership} = require("../middleware")
router.use(isLoggedIn, isPaid)
	
router.get("/campground/:id/comments/new", function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err)
		} else {
			res.render("newComments", {campground: campground})
		}
	})
})

router.post("/campground/:id/comments", function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err)
		} else {
			Comment.create(req.body.comments, function(err, comment) {
				if(err) {
					console.log(err)
				} else {
					comment.author.id = req.user._id
					comment.author.username = req.user.username
					comment.save()
					campground.comments.push(comment)
					campground.save()
					req.flash("success", "Comment added successfully.")
					res.redirect("/campground/"+ campground._id)
				}
			})
		}
	})
})
router.get("/campground/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("/campground/<%=req.params.id/comments")
		} else {
			res.render("editComment", {comment: foundComment, campground_id: req.params.id})
		}
	})
})
router.put("/campground/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment) {
		if(err) {
			res.redirect("back")
		} else {
			req.flash("success", "Successfully edited the comment.")
			res.redirect("/campground/" + req.params.id)
		}
	})	
})

router.delete("/campground/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			return res.redirect("back")
		} else {
			req.flash("success", "Deleted the comment.")
			res.redirect("/campground/" + req.params.id)
		}
	})
})

module.exports = router