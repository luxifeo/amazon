var express = require('express');
var router = express.Router();
var User = require('./users');
const {OperationHelper} = require('apac');

const opHelper = new OperationHelper({
  awsId:     process.env.ACCESSID,
  awsSecret: process.env.SECRET,
  assocId:   process.env.TAG
});
/* GET home page. */
router.get('/', function(req,res) {
  res.render('index',{title:"Amazon",user:''});
});
router.post('/search',function(req,res) {
  console.log(req.body);
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': req.body.key,
    //'ItemPage': 2,
    'ResponseGroup': 'Images,ItemAttributes,Offers',
    'Availability': 'Available',
  }).then((response) => {
    res.send(response.result.ItemSearchResponse.Items.Item);
    console.log("Success");
  }).catch((err) => {
  console.error("Oops! ", err);
  });
});
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
  User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.render('index',{title:'Amazon',user:user.username})
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
module.exports = router;
