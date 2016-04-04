var router = require('express').Router();
var authController = require('../controllers/authentication');
var apiController = require('../controllers/apicalls');
var secret = require('../config/tokens').secret;

router.post('/auth/facebook', authController.facebook);
router.post('/auth/github', authController.github);
router.post('/auth/instagram', authController.instagram);

router.post('/auth/signup', authController.register);
router.post('/auth/login', authController.login);

router.get('/api/instagram/:lat/:lng', apiController.instagramR)

module.exports = router;