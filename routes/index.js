let express = require('express');
let router = express.Router();
let User = require('./users');
let Order = require('./order');
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
router.get('/login',function(req,res) {
  res.render('login');
});
router.post('/start',function(req,res){
  opHelper.execute('ItemSearch',{
    'SearchIndex': 'All',
    'Keywords': ' ',
    'ResponseGroup': 'Images,ItemAttributes,Offers',
    'Availability': 'Available',
    'MinPercentageOff': 30,
  }).then((response) => {
    res.send(response.result.ItemSearchResponse.Items.Item);
    }).catch((err) => {
    console.error("Oops! ", err);
  })
})
router.post('/search',function(req,res) {
  opHelper.execute('ItemSearch', {
    'SearchIndex': req.body.category||'All',
    'Keywords': req.body.key,
    //'ItemPage': 2,
    'ResponseGroup': 'Images,ItemAttributes,Offers',
    'Availability': 'Available',
  }).then((response) => {
    res.send(response.result.ItemSearchResponse.Items.Item);
   
  }).catch((err) => {
  console.error("Oops! ", err);
  });
});
////////////////////////////////////////
router.post('/order',function(req,res) {
  req.session.cart = req.body.cart;
  res.send('Success');
})
router.post('/checkout',function(req,res){
  let newOrder = new Order({
    user: req.session.userId,
    items: req.body.cart,
    total: req.body.total,
    date: new Date()
  })
  console.log(newOrder);
  newOrder.save().then(()=>res.send('Success')).catch(e=>console.log(e));
})
router.post('/login', function (req, res, next) {
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
        req.session.userName = user.username
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
router.get('/order',function(req, res, next) {
  res.render('order',{user:req.session.userName,cart:req.session.cart})
})
// GET route after registering
router.get('/history',function(req,res){
  res.render('history');
})
router.get('/buyhistory',function(req,res){
  Order.find({user: req.session.userId}).select('items total date').exec((err,result)=>{
    if(err)
      console.log(err);
    else
    {
      res.json(result);
    }
  })

})
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
// GET admin
router.get('/admin',(req,res)=> {
  res.render('admin');
})
router.get('/buystat',(req,res)=> {
  Order.aggregate([{
    $group:
    {
        _id: { day: { $dayOfMonth: "$date"}, month: {$month: '$date'}, year: { $year: "$date" } },
        totalAmount: { $sum: '$total' },
        
        }
},{$sort:{'_id.year':1,'_id.month':1,'_id.day':1}}],(err,result)=>res.json(result))           
})
router.get('/income',(req,res)=>{
  Order.aggregate([{
    $group:
    {
        _id: { },
        totalAmount: { $sum: '$total' },
        
        }
  }],(err,result)=>res.json(result))
})
router.get('/topuser',(req,res)=>{
  Order.aggregate([{
    $group:
    {
        _id: {user: '$user'},
        totalAmount: { $sum: '$total' },
        
        }
},{$sort:{totalAmount:-1}},
   {
     $lookup:
       {
         from: "users",
         localField: "_id.user",
         foreignField: "_id",
         as: "info"
       }
  }
  ],(err,result)=>res.json(result))
})
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
