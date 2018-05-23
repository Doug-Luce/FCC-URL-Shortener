const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Url = mongoose.model('Url');
const shortSid = require('short-mongo-id');

router.get('/', (req, res, next) => {
  res.render('../views/index');
});

router.post('/submit', async (req, res, next)   => {
  if (!req.body) return res.sendStatus(400);
  
  // this checks for a valid url, if not valid go to the next middleware
  checkValidUrl(req.body.url, next);
  
  // save to the database
  const url = new Url({url: addHttp(req.body.url)}); // addHttp() checks if the url includes http://
  url.sid = shortSid(url._id);
  try {
    await url.save();
  } catch (error){
    console.log(error);
  }
  next();
});

// this will pull the short id off of the get request then
// check the database for that item. Then redirect to the appropriate URL
router.get("/:sid", async (req, res, next) => {
  await Url.findOne({'sid': req.params.sid }, 'sid url', function(err, url){
    res.redirect(url['url']);
  });

});

router.post('/submit', (req, res, next) => {
  Url.findOne({'url': addHttp(req.body.url)}, 'sid url', function (err, url){
    if (err) console.log(err);
    const responseObj = {
      URL: addHttp(req.body.url),
      Short_URL: `https://piquant-leo.glitch.me/${url.sid}`
    };
    res.send(responseObj);
  });
  
});

router.post('/submit', (req, res, next) => {
  res.send('Bad URL Input, redirecting');
  next();
});

let checkValidUrl = (url, next) => {
  const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);
  if (!url.match(regex)) {
    next();
  }
};

let addHttp = (url) => {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

module.exports = router;