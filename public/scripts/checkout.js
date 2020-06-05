var displayError = document.getElementById("card-errors")
function errorhandler(err) {
	changeLoadingState(false)
	displayError.textContent = err
}
var orderData = {
		items: [{ id: "coolCampsite-subscription" }],
	  	currency: "usd"
	};
	// Set your publishable key: remember to change this to your live publishable key in production
	// See your keys here: https://dashboard.stripe.com/account/apikeys
	// var stripe = Stripe(process.env.PUB-KEY);
var stripe = Stripe("pk_test_TAMDim6LUdjOcor92x7OAlsS00Dnyh08uK");
	
var elements = stripe.elements();
	
	// Set up Stripe.js and Elements to use in checkout form
var style = {
	base: {
		color: "#32325d",
	  }
	};

var card = elements.create("card", { style: style });
card.mount("#card-element");
	
card.addEventListener('change', function(event) {
  	//var displayError = document.getElementById('card-errors');
  	if (event.error) {
		errorhandler(event.error.message)
    	//displayError.textContent = event.error.message;
  	} else {
		errorhandler("")
    	//displayError.textContent = '';
  		}
	});
	
	var form = document.getElementById('payment-form');

	form.addEventListener('submit', function(ev) {
		ev.preventDefault();
		
		changeLoadingState(true);
		
		stripe.createPaymentMethod("card", card)
			  .then(function(result) {
				  if (result.error) {
					 // var displayError = document.getElementById('card-errors');
					  errorhandler(result.error.message)
					//  displayError.textContent = result.error.message;
					//showError(result.error.message);
				  } else {
					orderData.paymentMethodId = result.paymentMethod.id;

					return fetch("/pay", {
					  method: "POST",
					  headers: {
						"Content-Type": "application/json"
					  },
					  body: JSON.stringify(orderData)
					});
				  }
				})
			  .then(function(result) {
			  	return result.json();
				})
			  .then(function(response) {
				  if (response.error) {
					//var displayError = document.getElementById('card-errors');
					 errorhandler(response.error)
					//displayError.textContent = response.error.message;
				  } else {
					  changeLoadingState(false);
					//orderComplete(response.clientSecret);
					  //redirect to /campground// it invokes success flash message
					window.location.href = "/campground?paid=true"
				  }
				}).catch(function(err){
					errorhandler(err.error)
				});
	})
		
		// 	stripe.confirmCardPayment(clientSecret, {
		// 	payment_method: {
		// 	card: card,
		// 	billing_details: {
		// 			name: 'Jenny Rosen'
		// 	}
		// 	}
		// 	}).then(function(result) {
		// 	if (result.error) {
		// 	// Show error to your customer (e.g., insufficient funds)
		// 	  console.log(result.error.message);
		// 	} else {
		// 	// The payment has been processed!
		// 	  if (result.paymentIntent.status === 'succeeded') {
		// 		// Show a success message to your customer
		// 		// There's a risk of the customer closing the window before callback
		// 		// execution. Set up a webhook or plugin to listen for the
		// 		// payment_intent.succeeded event that handles any business critical
		// 		// post-payment actions.
		// 	  }
		// 	}
		// 	});
		
// Show a spinner on payment submission
function changeLoadingState(isLoading) {
    if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};