var router = require('express').Router();
var authController = require('../controllers/authentication');
var apiController = require('../controllers/apicalls');
var secret = require('../config/tokens').secret;

router.post('/auth/facebook', authController.facebook);
router.post('/auth/github', authController.github);
router.post('/auth/instagram', authController.instagram);


// http://localhost:8000/api/instagram/51.5285/-0.0847 returns JSON images.images[0]
router.get('/api/instagram/:lat/:lng', apiController.instagramR);

//http://localhost:8000/api/numcity/lisbon/portugal
router.get('/api/numcity/:city/:country', apiController.numCity);

// http://localhost:8000/api/wikitable/List_of_countries_by_inequality-adjusted_HDI
router.get('/api/wikitable/:wikipage', apiController.wikitable);

// http://localhost:8000/api/numtable/lisbon/portugal <-- BETTER DATA
router.get('/api/numtable/:city/:country', apiController.numtable);

http://localhost:8000/api/wikicity/:city
router.get('/api/wikicity/:city', apiController.wikicity);


router.get('/api/instaTest/', apiController.instaTest);

module.exports = router;