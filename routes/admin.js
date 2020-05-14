var express = require('express');
var router = express.Router();
var session = require('express-session');

const fileController = require('../controllers/fileController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const appController = require('../controllers/applicationController');

router.get('/', function(req, res, next) {
  res.redirect('/admin/login');
});

router.route('/login')
  .get(function(req, res, next) {
      if(req.session.admin){
        res.redirect('/admin/dashboard');
      } else {
        res.render('admin/login');
      }
  })
  .post(userController.signin);

router.route('/users')
  .get(function(req, res, next) {
      if(req.session.admin){
        res.render('admin/users', req.session.admin);
      } else {
        res.redirect('/admin/login');
      }
  })
  .post(userController.getAllUsers);

router.route('/dashboard')
  .get(function(req, res, next) {
      if(req.session.admin){
        res.render('admin/dashboard', req.session.admin);
      } else {
        res.redirect('/admin/login');
      }
  });

router.route('/event_detail')
  .get(function(req, res, next) {
    if(req.session.admin){
      res.render('admin/event_detail', req.session.admin);
    } else {
      res.redirect('/admin/login');
    }
  })
  .post(eventController.getEventInfo);

router.get('/events_all', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/events_all', req.session.admin);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/events_resolved', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/events_resolved', req.session.admin);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/events_unresolved', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/events_unresolved', req.session.admin);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/settings', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/settings', req.session.admin);
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/applications_all', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/applications_all', req.session.admin);
  } else {
    res.redirect('/admin/login');
  }
});
  
router.route('/application_add')
  .get(function(req, res, next) {
      if(req.session.admin){
        res.render('admin/application_add', req.session.admin);
      } else {
        res.redirect('/admin/login');
      }
  })
  .post(appController.creatApplication);

router.route('/application_edit')
  .get(function(req, res, next) {
      if(req.session.admin){
        res.render('admin/application_edit', req.session.admin);
      } else {
        res.redirect('/admin/login');
      }
  })
  .post(appController.getApplicationByID);

router.get('/logout', function(req, res, next) {
  req.session.admin = null;
  res.redirect('/admin/login');
});

router.get('/reset/:token', function(req, res, next) {
  if(req.params.token == session.forgotadmin.resetPasswordToken){
    res.render('admin/resetpassword', req.session.admin);
  } else {
    res.render('admin/resetpasswordfail', req.session.admin);
  }
});

router.post('/signup', userController.signup);
router.post('/getevents',eventController.getEvents);
router.post('/forgot', userController.forgotPassword);
router.post('/geteventlog', eventController.getEventLog);
router.post('/userbyemail', userController.getUserByEmail);
router.post('/updatepassword', userController.updatepassword);
router.post('/getallapplication', appController.getAllApplication);
router.post('/application_update', appController.updateApplication);
router.post('/updateeventscript', eventController.updateEventScript);
router.post("/getlastversion", fileController.getLastVersion);
router.post("/upload", fileController.creatFile, fileController.uploadfile);

router.get('*', function(req,res) {
  res.render('admin/template/error');
});

module.exports = router;
