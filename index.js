const stripe = require('stripe')('your sk here!');

const express = require('express');
const bodyParser = require('body-parser');

const endpointSecret = "whsec_b2495cca3c14099a63ed8e8f3baee72fd17f9738f53ad46e2ba9b152d65d755d";


const { resolve } = require("path");

const app = express();


app.use(express.static('.'));
app.use(express.json());



	
	
app.get("/",function(req,res){
	
	
	res.send('Que pedo raza')
	
});

//HOLA 

app.post("/create-account",function(req,res){
	
	var {email} = req.body;
	var {country} = req.body;
	
	//res.send(email);
	
	stripe.accounts.create({
	  type: 'express',
	  country,
	  email,
	  business_type: 'individual',
	  capabilities: {
		  card_payments: {requested: true},
		transfers: {requested: true},
		},
	  },
	  function(err,account){
		  if(err){
			  console.log('Error',err);
			  res.send({
				  success:false,
				  message:'Error',
			  });
		  }else{
			  res.send(account.id);
		  }
	  });
	  
});


app.post("/create-account-link", function(req,res){


	var {account}	= req.body;
	
	
	stripe.accountLinks.create({
		refresh_url: 'https://www.youtube.com/watch?v=KXw8CRapg7k',
		return_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=32s',
		account,
		type: 'account_onboarding',
		
		},function(err,accountLink){
			
		if(err){
			
			 console.log('Error',err);
			  res.send(err);
			  
		}else{
			res.send(accountLink);
		}
			
		});
	
	
});

app.post("/create-login-link", function(req,res){
	
	var {account} = req.body;
	
	
	stripe.accounts.createLoginLink(account,
	function(err,login_link){
		if(err){
			
			 console.log('Error',err);
			  res.send(err);
			  
		}else{
			res.send(login_link);
		}
	});
	
});

app.post("/delete-account",function(req,res){
	
	var {account} = req.body;
	
	stripe.accounts.del(
	account,function(err,accountDeletedInfo){
		if(err){
		console.log('Error',err);
		res.send(err);
		
		}else{
			res.send(accountLink,accountDeletedInfo);
			}
			});

});


app.post("/verify-account-details-submited",function(req,res){
	
	var {account} = req.body;
	
	stripe.accounts.retrieve(
	account
	,function(err,accountObject){
		
		if(err){
			
			 console.log('Error',err);
			 res.send(err);
			  
		}else{
			res.send(accountObject.details_submitted);
		}
		
	});
	
	
});


app.post("/verify-the-account-exists", function(req,res){
	
	var {account} = req.body;
	
	stripe.accounts.retrieve(
	account
	,function(err,accountObject){
		
		if(err){
			
			 console.log('Error',err);
			 res.send(err);
			  
		}else{
			res.send(accountObject.details_submitted);
		}
		
	});
	
	
	
});
/*
app.post("/create-payment-intent",async(req,res) => {
	
	const {items} = req.body;
	const {currency} = req.body;
	const {destination} = req.body;
	
	const paymentIntent = await stripe.paymentIntents.create({

    amount: calculateOrderAmou417nt(items),
    currency: currency,
	application_fee_amount: calculateAplicationFeeAmount,
	transfer_data{
		destination
	}
	
	
  });
  
  res.send({

    clientSecret: paymentIntent.client_secret

  });
	
	
	
});
*/


app.post('/payment-sheet', async (req, res) => {
	
  // Use an existing Customer ID if this is a returning customer.
  
  const customer = await stripe.customers.create();
  
  
  var {destination} = req.body; 
  var {currency} = req.body;
  var {amount} = req.body;
  
  //var {items} = req.body;
  
  console.log("destination: " + destination);
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency,
    customer: customer.id,
    payment_method_types: ['card'],
    application_fee_amount: calculateOrderFee(amount),
    transfer_data: {
      destination
    }
  });

//hola  
//hola 


  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'your sk key here!'
  });
  
});



const calculateOrderAmount = amount => {

  // Replace this constant with a calculation of the order's amount

  // Calculate the order total on the server to prevent

  // people from directly manipulating the amount on the client

  return amount * 100;

};

const calculateOrderFee = amount => {

  // Replace this constant with a calculation of the order's amount

  // Calculate the order total on the server to prevent

  // people from directly manipulating the amount on the client

  var realAmount = calculateOrderAmount(amount);

  return realAmount * 0.15;

};
	

app.listen(process.env.PORT,function(){
	console.log('Hello stranger! ');
});
