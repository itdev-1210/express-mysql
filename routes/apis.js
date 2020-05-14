var express = require('express');
var router = express.Router();

const fileController = require('../controllers/fileController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const applicationController = require('../controllers/applicationController');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/addevent', userController.auth, eventController.createEvent);
router.post('/getuserinfo', userController.auth, userController.getUserInfo);
router.post('/geteventinfo', userController.auth, eventController.getEventInfo);
router.post('/download', userController.auth, fileController.download);
router.get('/getversioncheck', fileController.getLastVersion);
router.post('/getapplicationinfo', userController.auth, applicationController.searchByName);

module.exports = router;
