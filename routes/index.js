var express = require('express');
var router = express.Router();
const {OperationHelper} = require('apac');

const opHelper = new OperationHelper({
  awsId:     process.env.ACCESSID,
  awsSecret: process.env.SECRET,
  assocId:   process.env.TAG
});
/* GET home page. */
router.get('/search/:key', function(req, res, next) {
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': req.params.key,
    'ResponseGroup': 'Images,ItemAttributes,Offers'
  }).then((response) => {
      res.send(response.result.ItemSearchResponse.Items.Item);
  }).catch((err) => {
      console.error("Something went wrong! ", err);
  });
  //res.render('index', { title: 'Express' });
});
router.get('/', function(req,res) {
  res.render('index',{title:"Amazon"});
});
router.post('/search',function(req,res) {
  console.log(req.body.key);
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': req.body.key,
    //'ItemPage': 2,
    'ResponseGroup': 'Images,ItemAttributes,Offers'
  }).then((response) => {
    res.send(response.result.ItemSearchResponse.Items.Item);
    console.log("Success");
  }).catch((err) => {
  console.error("Oops! ", err);
  });
});
module.exports = router;
