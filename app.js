// import the required packages 
var express            = require("express"),
 app                   = express(),
 mongoose              = require("mongoose"),
 bodyParser            = require('body-parser'),
 passport              = require("passport"),
 LocalStrategy         = require("passport-local"),
 fs                    = require('fs'),
 path                  = require('path'), 
 paypal                = require('paypal-rest-sdk'),
 passportLocalMongoose = require("passport-local-mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://mongo:27017/user_cred");


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

var donattionSchema = new mongoose.Schema({
    amount: String,
    currency: String,
    description: String
});

var User = mongoose.model("Donation", donattionSchema);
//app.locals.baseurl = 'http://localhost:3000';

fs.readFile(__dirname+'/paypal_cred.json', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);    
    }
    else {  
        const client_details = JSON.parse(data);
        // paypal auth configuration
        var config = {            
            "api" : {
            "host" : "api.sandbox.paypal.com",
            "mode" : "sandbox",            
            'client_id': client_details.client_id, // please provide your client id here 
            'client_secret': client_details.client_secret // provide your client secret here
            }
        }
        
        paypal.configure(config.api);
       
        // set public directory to serve static html files 
        app.use('/', express.static(path.join(__dirname, 'public'))); 

        // redirect to store when user hits http://localhost:
        app.get('/' , (req , res) => {
            res.redirect('/index.html'); 
        })

        app.get('/fund', (req, res) => {
            res.redirect('index-new.html');
        })

        // start payment process 
        app.post('/paynow' , ( req , res ) => {
            
            // create payment object     
            var payment = {
                    "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://127.0.0.1:3000/success",
                "cancel_url": "http://127.0.0.1:3000/err"
            },
            "transactions": [{
                "amount": {
                    "total": parseFloat(req.body.amount),
                    "currency": "EUR"
                },
                "description": " a book on mean stack "
            }]
            }
            //"total": parseInt(req.body.amount),
            
            // call the create Pay method 
            createPay( payment ) 
                .then( ( transaction ) => {
                    var userData = new User(req.body);
                    userData.save();
                    console.log("data saved!");
                    var id = transaction.id; 
                    var links = transaction.links;
                    var counter = links.length; 
                    while( counter -- ) {
                        if ( links[counter].method == 'REDIRECT') {
                            // redirect to paypal where user approves the transaction 
                            return res.redirect( links[counter].href )
                        }
                    }
                })
                .catch( ( err ) => { 
                    console.log( err ); 
                    res.status(400).redirect('/err');
                });
        }); 


        // success page 
        app.get('/success' , (req ,res ) => {
            console.log(req.query); 
            res.redirect('/success.html'); 
        })

        // error page 
        app.get('/err' , (req , res) => {
            console.log(req.query); 
            res.redirect('/err.html'); 
        })

        // app listens on 3000 port 
        app.listen( 3000 , () => {
            console.log(' app listening on 3000 '); 
        })
    }
});


// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}	
