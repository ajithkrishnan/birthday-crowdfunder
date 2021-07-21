/*
 * Author: Rohit Kumar
 * Date: 22-07-2015
 * App Name: Nodejs-Paypal
 * Website: iamrohit.in
 * Description: Program to Integrate paypal payment gateway in nodejs
 */
var path = require('path'); 
var http=require('http');
var express    = require("express");
var paypal = require('paypal-rest-sdk');
var bodyParser = require('body-parser');
var app = express();
var port = Number(process.env.PORT || 5000);
var fs = require('fs');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));
app.locals.baseurl = 'http://localhost:5000';


fs.readFile(__dirname+'/paypal_cred.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);    
  }
  else {  
    const client_details = JSON.parse(data);
    // paypal auth configuration
    var config = {
      "port" : 5000,
      "api" : {
        "host" : "api.sandbox.paypal.com",
        "port" : "",            
        'client_id': client_details.client_id, // please provide your client id here 
        'client_secret': client_details.client_secret // provide your client secret here
      }
    }
    
    paypal.configure(config.api);
    
    // Page will display after payment has beed transfered successfully
    app.get('/success', function(req, res) {
      res.send("Payment transfered successfully.");
    });
    
    // Page will display when you canceled the transaction 
    app.get('/cancel', function(req, res) {
      res.send("Payment canceled successfully.");
    });
   

    app.get('/', function(req, res) {
      res.sendFile(__dirname+'/index-new.html');
    });

    
    /*
    app.use('/', express.static(path.join(__dirname, 'public'))); 

    // redirect to store when user hits http://localhost:
    app.get('/' , (req , res) => {
        res.redirect('/index.html'); 
    })
    */
    
    app.post('/paynow', function(req, res) {
      // paypal payment configuration.
      console.log(req.body.amount)
      var payment = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": app.locals.baseurl+"/success",
        "cancel_url": app.locals.baseurl+"/cancel"
      },
      "transactions": [{
        "amount": {
          "total":parseInt(req.body.amount),
          "currency":  req.body.currency
        },
        "description": req.body.description
      }]
    };
    
      paypal.payment.create(payment, function (error, payment) {
      if (error) {
        console.log(error);
      } else {
        if(payment.payer.payment_method === 'paypal') {
          req.paymentId = payment.id;
          var redirectUrl;
          console.log(payment);
          for(var i=0; i < payment.links.length; i++) {
            var link = payment.links[i];
            if (link.method === 'REDIRECT') {
              redirectUrl = link.href;
            }
          }
          res.redirect(redirectUrl);
        }
      }
    });
    });

    
  }
});


 

 
// Starting server
var server = http.createServer(app).listen(port, function() {
console.log("Listening on " + port);
});