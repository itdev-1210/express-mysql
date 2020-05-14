'user strict';

const db = require('../lib/database');
const constants = require('../config/const');

var UserEvent = function(user, event, computer) {
	this.eventid = event.eventid;
	this.userid = user.id;
	this.username = user.fullname
	this.os = computer.os;
	this.os_build_version = computer.os_build_version;
	this.message = event.message;
	this.created = new Date();
	this.modified = new Date();
};

UserEvent.createEvent = function (userevent, callback) {
	db().query('INSERT INTO userevents SET ?', userevent, function (err, result) {
    if (err) {
      console.log("error ocurred",err);
      callback(err, null);
    } else {
      console.log('success: ', result);
      callback(null, result);
    }
	});
}

UserEvent.getUserEventByUserId = function(userid, callback) {
	db().query('SELECT * FROM userevents WHERE userid = ?',[userid], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
      if (result.length > 0) {
    		console.log("success", result);
      	callback(null, result);
      } else {
       	console.log("error ocurred","Account no exist");
				callback(null, 204);
      }
    }
	});
}

UserEvent.getEventLogByEventId = function(eventid, callback) {
	db().query('SELECT * FROM userevents WHERE eventid = ?',[eventid], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
		}
	});
}

module.exports = UserEvent;