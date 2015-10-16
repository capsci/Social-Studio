var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET SocialStudio home page. */
router.get('/SocialStudio', function(req, res, next) {
  res.render('socialStudio', { title: 'SocialStudio - check your social feeds over a coffee' });
});

/* GET SocialStudio demo page for gestures. */
router.get('/SocialStudioGestures', function(req, res, next) {
  res.render('socialStudioGestures', { title: 'Gestures Demo > SocialStudio - check your social feeds over a coffee' });
});

/* GET SocialStudio demo page for audio commands. */
router.get('/SocialStudioVoice', function(req, res, next) {
  res.render('socialStudioVoice', { title: 'Gestures Demo > SocialStudio - check your social feeds over a coffee' });
});

/* GET SocialStudio demo page for audio commands. */
router.get('/SocialStudioDemo', function(req, res, next) {
  res.render('socialStudioDemo', { title: 'SocialStudio Demo > SocialStudio - check your social feeds over a coffee' });
});

module.exports = router;
