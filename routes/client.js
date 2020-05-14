var express = require('express');
var router = express.Router();
var session = require('express-session');

const userController = require('../controllers/frontController/userController');
const subscriptionsController = require('../controllers/subscriptionsController');
const fileController = require('../controllers/fileController');

router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.route('/login')
  .get(function(req, res, next) {
    if(req.session.key){
      res.redirect('/download');
    } else {
      res.render('client/login');
    }
  })
  .post(userController.signin);

router.get('/profile', function(req, res, next) {
  if(req.session.key){
    res.render('client/profile', req.session.key);
  } else {
    res.redirect('/login');
  }
});

router.get('/download', function(req, res, next) {
  if(req.session.key){
    if (isExpired(req.session.key.expired)){
      res.redirect('/subscription');
    } else {
      res.render('client/download', req.session.key);
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/changepassword', function(req, res, next) {
  if(req.session.key){
    res.render('client/changepassword', req.session.key);
  } else {
    res.redirect('/login');
  }
});

router.get('/subscription', function(req, res, next) {
  if(req.session.key){
    res.render('client/subscription', req.session.key);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard', function(req, res, next) {
  if(req.session.key){
    res.render('client/dashboard', req.session.key);
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.key = null;
  res.redirect('/login');
});

router.get('/reset/:token', function(req, res, next) {
  if(req.params.token == session.forgotuser.resetPasswordToken){
    res.render('client/resetpassword', req.session.key);
  } else {
    res.render('client/resetpasswordfail', req.session.key);
  }
});
router.get('/test', function(req, res, next) {
  res.render('client/resetpasswordfail', req.session.key);
});

router.get('/downloadfile', userController.download);

router.post('/signup', userController.signup);
router.post('/forgot', userController.forgotPassword);
router.post('/userbyemail', userController.getUserByEmail);
router.post('/changepassword', userController.changePassword);
router.post('/updatepassword', userController.updatepassword);
router.post('/subscriptions', subscriptionsController.create);
router.post('/getlastversion', fileController.getLastVersion);
router.post('/getsubscriptioninfo', subscriptionsController.getSubscriptionInfo);
// router.post('/downloadfile', userController.download);

router.get('*', function(req,res) {
  res.render('client/template/error');
})

var isExpired = function(expired){
  if(!expired) return true;
  const current = new Date();
  const userexpired = new Date(expired);
  return (current.getTime() > userexpired.getTime());
}

module.exports = router;
