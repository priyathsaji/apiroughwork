var express = require('express');
var app = express();
var fs = require("fs");
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

var s3Bucket = new AWS.S3({params:{Bucket:'rentit-profile-pics'}});


var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).single('file'));

app.get('/index3.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index3.html" );
})

app.post('/file_upload', function (req, res) {
   console.log(req.file.originalname);
   console.log(req.file.path);
   console.log(req.file.mimetype);
   var file = __dirname + "/" + req.file.originalname;
   
   fs.readFile( req.file.path, function (err, data) {
    /*  fs.writeFile(file, data, function (err) {
         if( err ){
            console.log( err );
            }else{
               response = {
                  message:'File uploaded successfully',
                  filename:req.file.originalname
               };
            }
         console.log( response );
         res.end( JSON.stringify( response ) );
         //var filepath = file;
			//fs.unlinkSync(filepath); // remove a file from server
      });*/
   

   var data1 = {Key: req.file.originalname, Body:data};
    s3Bucket.putObject(data1, function(err, data1){
  if (err) 
    { console.log('Error uploading data: ', data1); 
    } else {
      console.log('succesfully uploaded the image!');
    }
    });
  });

   var urlParams = {Bucket: 'rentit-profile-pics', Key: 'logo.png'};
s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
  console.log('the url of the image is', url);
})
})


app.get('/', function (req, res) {
  res.send('Hello World! (' + Date.now() + ")");
});

var server = app.listen(3000, function () {
  console.log("Express server is started. (port: 3000)");
});



/*

var server = app.listen(80,function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

/*
var server = app.listen(3000,'192.168.1.7' || 'localhost',function() {
    console.log('Application worker ' + process.pid + ' started...');
  }
  );

  */