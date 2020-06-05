var express = require("express")
var	router = express.Router()
var User = require("../models/user")
var passport = require("passport")
//var middleware = require("../middleware")
const { isLoggedIn } = require("../middleware")

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// var customer = stripe.customers.create({
// 	  name: 'Jenny Rosen',
// 	  address: {
// 		line1: '510 Townsend St',
// 		postal_code: '98140',
// 		city: 'San Francisco',
// 		state: 'CA',
// 		country: 'US',
// 	  }
// 	});


router.get("/register", function(req, res) {
	res.render("register")
})




router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			req.flash("error", err.message)
			return res.redirect("/register")
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to CoolCampsites " + user.username +"!!!!")
			res.redirect("/checkout")
		})
	})
})
router.get("/login", function(req, res) {
	res.render("login")
})
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campground",
	failureRedirect: "/login"
}), function(req, res) {	
})
router.get("/logout", function(req, res) {
	req.logout()
	req.flash("success", "Successfully LoggedOut!!!")
	res.redirect("/")
})

router.get('/checkout', isLoggedIn, function(req, res) {
		if(req.user.isPaid) {
			req.flash("success", "your account is already paid")
			res.redirect("/campground")
		}		
		res.render("checkout",{ amount : 20})
	
	// try {
	// 	const paymentIntent = await stripe.paymentIntents.create({
	//   	amount: 2000,
	//   	currency: 'usd'
	// });
	// var {client_secret} = paymentIntent
	//   //const intent = // ... Fetch or create the PaymentIntent
	// res.render('checkout', { client_secret });
	// } catch(err) {
	// 	req.flash("error", err.message)
	// 	res.redirect("back")
	// }
});

router.post("/pay", async (req, res) => {
  const { paymentMethodId, items, currency, username } = req.body;
  const orderAmount = 2000 //calculateOrderAmount(items);
  try {
    // Create new PaymentIntent with a PaymentMethod ID from the client.
    const intent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: currency,
	  description: res.locals.currentUser.username,//'Software development services',
	  shipping: {
    	name: 'Jenny Rosen',
    	address: {
      		line1: '510 Townsend St',
      	postal_code: '98140',
     	city: 'San Francisco',
      	state: 'CA',
      	country: 'US',
    	},
  	},
      payment_method: paymentMethodId,
      error_on_requires_action: true,
      confirm: true
    });
	  
    console.log("💰 Payment received!");
	req.user.isPaid = true;
	await req.user.save()
    // The payment is complete and the money has been moved
    // You can add any post-payment code here (e.g. shipping, fulfillment, etc)

    // Send the client secret to the client to use in the demo
    res.send({ clientSecret: intent.client_secret });
  } catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, card authentication etc
    // See https://stripe.com/docs/declines/codes for more
    if (e.code === "authentication_required") {
      res.send({
        error:
          "This card requires authentication in order to proceeded. Please use a different card."
      });
    } else {
      res.send({ error: e.message });
    }
  }
});

module.exports = router