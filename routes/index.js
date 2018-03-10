var express = require('express');
var router = express.Router();
var details = require('./details');
const {OperationHelper} = require('apac');

const opHelper = new OperationHelper({
  awsId:     details.AccessID,
  awsSecret: details.Secret,
  assocId:   details.Tag
});
/* GET home page. */
router.get('/search/:key', function(req, res, next) {
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': req.params.key,
    'ResponseGroup': 'ItemAttributes,Offers'
  }).then((response) => {
      res.send(response.result);
  }).catch((err) => {
      console.error("Something went wrong! ", err);
  });
  //res.render('index', { title: 'Express' });
});
router.get('/', function(req,res) {
  res.render('index',{title:"Amazon"});
})
module.exports = router;
