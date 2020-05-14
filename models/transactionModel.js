'user strict';

require('dotenv').config();
const db = require('../lib/database');
var session = require('express-session');
const constants = require('../config/const');

var Transaction = function(req, transaction) {
	this.userid = transaction.userid;
	this.useremail = transaction.email;
	this.card_number = transaction.card_number;
	this.type = transaction.type;
	this.cvc = transaction.cvc;
	this.card_expired_date = transaction.expire_date;
	this.tokenid = transaction.tokenid;
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

Transaction.create = function (transaction, callback) {
	console.log("create", transaction);
	db().query('INSERT INTO transactions SET ?', transaction, function (err, result) {
		if (err) {
		console.log("error ocurred",err);
		callback(err, null);
		} else {
		console.log('The solution is: ', result);
		callback(null, result);
		}
	});
}

module.exports = Transaction;