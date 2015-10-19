'use strict';

var express = require('express');
var multer  = require('multer');
var mongoose = require('mongoose');
var app     = express();
var router  = express.Router();
var bodyParser = require('body-parser');
var pctrLclzr = require('picture-localizer');
var env = require('./env');

pctrLclzr.gmapApiKey = process.env['GMAP_KEY'];

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/txdo');


var ProblemSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
  note: String,
  lat: Number,
  lng: Number,
  updated_at: { type: Date, default: Date.now },
});

var Problem = mongoose.model('Problem', ProblemSchema);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './server/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var upload = multer({ storage: storage });

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to /' });
});

router.route('/problems')

  .post(upload.single('upload'), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file);
    // req.body will hold the text fields, if there were any
    res.end("File uploaded.");
    var p = new Problem({ name: 'Zildjian' });
    p.lat = '321';
    p.lng = '123';
    pctrLclzr.localize(req.file.path , function(data){
      console.log(data);
      p.lat = '456';
      p.lng = '654';
      p.save(function (err) {
        if (err) // ...
          console.log('error saving in db');

        console.log('saved in db');
      });
    });

  })

  .get(function(req, res) {
    Problem.find(function(err, problem) {
      if (err)
        res.send(err);

      res.json(problem);
    });
  });

router.route('/problems/:problem_id')

  .get(function(req, res) {
    Problem.findById(req.params.problem_id, function(err, problem) {
      if (err)
        res.send(err);
      res.json(problem);
    });
  })

  .delete(function(req, res) {
    Problem.remove({
        _id: req.params.problem_id
    }, function(err, problem) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});
app.use(router);

app.listen(3000, function(){
    console.log("Working on port 3000");
});
