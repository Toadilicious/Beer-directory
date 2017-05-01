var proxy = require('express-http-proxy');
var express = require('express');
var router = express.Router();

var Breweries = require('../models/breweries.js'); // employee schema

// 3rd party apis need to be accessed throughh a proxy
// if this is deleted requests to brewerydb will fail
router.use('/proxy', proxy('api.brewerydb.com' ,{
  proxyReqPathResolver: function(req) {
    return require('url').parse(req.url).path + "&key=cbf87c44338b3c02f584632bf9a5cf01"
  }
}))


router.post('/', function(req, res){
  console.log('create new Brewery', req.body);
  Breweries.create(req.body, function (err, createdBrewery){
    res.json(createdBrewery);
  });
});

//update record
router.put('/:id', function(req, res){
  Breweries.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, udpatedBrewery){
    if(err) {console.log(err);}
    res.json(udpatedBrewery);
  });
});

// delete record
router.delete('/:id', function(req, res){
  Breweries.findByIdAndRemove(req.params.id, function(err, deletedBrewery){
    res.json(deletedBrewery);
  });
});

//breweries index page : for testing purpose
router.get('/', function(req, res){
  res.send('List  All Brewery here');
});

module.exports  = router;