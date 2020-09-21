let express = require('express');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
require('dotenv').config();

//load and initialize messagebird sdk
let messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);

//set up and configure express framework
let app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended : true }));

//asking phone number
app.get('/', function(req, res) {
    res.render('step1');
  });

//verification
  app.post('/step2', function(req, res) {
    let number = req.body.number;
    messagebird.verify.create(number, {
       originator : 'Code',
        template : 'Your verification code is %token.'
    }, function (err, response) {
        if (err) {
            console.log(err);
            res.render('step1', {
              error : err.errors[0].description
            });
        } else {
            console.log(response);
            res.render('step2', {
                id : response.id
            });
        }
    })
 });
 

 //make request to verify api
app.post('/step3', function(req, res) {
    let id = req.body.id;
    let token = req.body.token;
    messagebird.verify.verify(id, token, function(err, response) {
      if (err) {
        console.log(err);
        res.render('step2', {
          error: err.errors[0].description,
          id: id,
        });
      } else {
        console.log(response);
        res.render('step3');
      }
    });
  });


  //PORT
app.listen(4000, () => {
    console.log("Listening at : 4000...");
});