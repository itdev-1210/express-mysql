'user strict';

require('dotenv').config();
const db = require('../lib/database');
var session = require('express-session');
const constants = require('../config/const');


var Subscription = function(req, subscription) {
	this.userid = subscription.userid;
	this.useremail = subscription.email;
	this.card_number = subscription.card_number;
	this.type = subscription.type;
	this.cvc = subscription.cvc;
	this.card_expired_date = subscription.expire_date;
	this.tokenid = subscription.tokenid;
	this.created = new Date();
	var currentDate;
	if(req.session.key.expired){
		currentDate = new Date(req.session.key.expired);
	} else {
		currentDate = new Date();
	}
	if(type=="yearly"){
		currentDate.setMonth(currentDate.getMonth()+12);
		this.expired_date = currentDate;
	}else{
		currentDate.setMonth(currentDate.getMonth()+1);
		this.expired_date = currentDate;
	}
};

Subscription.create = function (subscription, callback) {
	console.log("create", subscription);
	db().query('INSERT INTO subscriptions SET ? ON DUPLICATE KEY UPDATE ?', [subscription, subscription], function (err, result) {
		if (err) {
		console.log("error ocurred",err);
		callback(err, null);
		} else {
		console.log('The solution is: ', result);
		callback(null, result);
		}
	});
}

// Subscription.update = function(subscription,id, callback) {
//   db().query('UPDATE subscriptions SET ? WHERE userid = ?', [subscription, id], function (err, result) {
//     if (err) {
//       console.log("error ocurred", err);
//       callback(err, null);
//     } else {
//       console.log("success", result);
//       callback(null, 'success');
//     }
//   });
// }

Subscription.getInfoByUserID = function(userid, callback) {
	db().query('SELECT * FROM subscriptions WHERE userid = ?',[userid], function (err, result) {
		if (err) {
			console.log("error ocurred",err);
			callback(err, null);
		} else {
			console.log("success", result);
			callback(null, result);
		}
	});
}

module.exports = Subscription;