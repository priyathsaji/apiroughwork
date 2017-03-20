var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
//var User = require('./basic node js/model');

var connectionOptions ={
   replset: {
        socketOptions: {
            connectTimeoutMS: 300000, // 5 minutes
            keepAlive: 120
        },
        ha: true, // Make sure the high availability checks are on
        haInterval: 10000, // Run every 10 seconds
    }
}
mongoose.connect("mongodb://user:password@ds147069.mlab.com:47069/login_activity",connectionOptions,function(err){
   if(err) console.log(err);
});
var Schema = mongoose.Schema;

var userSchema = new Schema({
   first_name:String,
   last_name:String
});

var User = mongoose.model('PRIYATHSAJI',userSchema);


var app = express();
app.get('/',function(req,res){
   res.send('hello world');
})

app.use(express.static('public'));
app.get('/index.html',function(req,res){
   res.sendFile(__dirname+"/"+"index.html");
})
app.get('/index2.html',function(req,res){
   res.sendFile(__dirname+"/"+"index2.html");
})

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

app.post('/process_post', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   var newUser = User({
      first_name: req.body.first_name,
      last_name: req.body.last_name
   });
   newUser.save(function(err){
      if(err) throw err;

      console.log('User created');
   })
   console.log(response);
   res.end(JSON.stringify(response));
})
app.get('/process_get',function(req,res){
   response = {
      first_name:req.query.firstname,
      last_name:req.query.lastname
   };
   var newUser = User({
      first_name:req.query.firstname,
      last_name:req.query.lastname
   });

   newUser.save(function(err){
      if(err) throw err;

      console.log('User created!');
   })
   console.log(response);
   res.end(JSON.stringify(response));
})



var server = app.listen(8081,function(){
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at https://%s:%s",host,port)
})