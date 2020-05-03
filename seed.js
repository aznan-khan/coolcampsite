var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comments")


	data = [
		{
			name: "Cloudy Gloudy",
			image: "https://pixabay.com/get/57e2d1464357a514f1dc84609620367d1c3ed9e04e507441722b7ed19e49c5_340.jpg",
			description: "Nice oogle dooble place !!!!"
		},
		{
			name: "Mountain Army",
			image: "https://pixabay.com/get/52e9d24a4f57a414f1dc84609620367d1c3ed9e04e507441722b7ed19e49c5_340.jpg",
			description: "Great obble bobble place !!!!"
		},
		{
			name: "Lonely with Sun only",
			image: "https://pixabay.com/get/57e8d7414e5aa814f1dc84609620367d1c3ed9e04e507441722b7ed19e49c5_340.jpg",
			description: "Nice oogle dooble place !!!!"
		}
	]
	function seedDB() {
		Campground.remove({}, function(err) {
		// 	if(err) {
		// 		console.log(err)
		// 	} 
		// 	console.log("Removed campground")

		// 	data.forEach(function(seed) {
		// 		Campground.create(seed, function(err, campground) {
		// 			if(err) {
		// 				console.log(err)
		// 			} else {
		// 				console.log("added")
		// 				Comment.create(
		// 					{
		// 						text: "Jealous of these Crapy Travellers",
		// 						author: "QuarantinedAadmi"
		// 					}, function(err, comment) {
		// 						if(err) {
		// 							console.log(err)
		// 						} else {
		// 							campground.comments.push(comment)
		// 							campground.save()
		// 						}
		// 					})
		// 			}
		// 		})
		// 	})
			
		 })
	}
module.exports = seedDB;
