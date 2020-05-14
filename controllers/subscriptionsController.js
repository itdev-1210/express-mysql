'user strict';

var session = require('express-session');
// var stripe = require('stripe')("sk_test_NgrLLNY36tZfT9ROuRAvbctL");
var stripe = require('stripe')("sk_test_P55TbHid3FgazJT391mJVIU3");

const constants = require('../config/const');
const userModel = require('../models/userModel');
const subscriptionModel = require('../models/subscriptionModel');
const transactionModel = require('../models/transactionModel');

var returnError = function(res) {
  return res.json({
    code: constants.ErrorCode,
    success: false,
    msg: 'Error',
  });
};
var returnSuccess = function(res) {
  return res.json({
    code: constants.SuccessCode,
    success: true,
    msg: 'Success',
  });
}

exports.create = function(req, res) {
  console.log('sucess', req.user);
  var interval;
  var amount;
  var name;
  var nickname;
  type = req.body.type;
  if (type=='monthly') {
    amount = 1000;
    name = 'monthly';
    interval = 'month';
    nickname = 'monthly';
  } else {
    amount = 10000;
    name = 'yearly';
    interval = 'year';
    nickname = 'yearly';
  }
  stripe.products.create({
    name: name,
    type: 'service',
  }, function(err, product) {
    console.log('product', product);
    if (err) returnError(res);
      stripe.plans.create({
          currency:'usd',
          interval:interval,
          product: product.id,
          nickname: nickname,
          amount: amount,
          usage_type: "licensed",
      }, function(err, plan) {
        console.log('plan', plan);
        if(err) returnError(res);
        stripe.customers.create({ 
          email: req.session.key.email, 
          plan: plan.id, 
          card: req.body.tokenid 
        }, function(err, customer) {
            if (err) returnError(res);
            // user.customerToken = customer.id;
            stripe.subscriptions.create({
              customer: customer.id,
              items: [
                {
                  plan: plan.id,
                  // quantity: 1,
                },
              ]
            }, function(err, subscription) {
              if (err) returnError(res);
              const subscriptioin = new subscriptionModel(req, req.body); 
              subscriptionModel.create(subscriptioin, function(err, result) {
                if (err) returnError(res);
                const transaction = new transactionModel(req, req.body);
                transactionModel.create(transaction, function(err, result) {
                  if (err) returnError(res);
                  userModel.updateExpired(req, transaction.userid, transaction.expired_date, function(err, result) {
                    if (err) returnError(res);
                    returnSuccess(res);
                  });
                });
              });
          });
        });
      });
  });
};

exports.getSubscriptionInfo = function(req, res) {
  if(!req.session.key.id){
    return res.json({
      success: false,
      msg: err.message,
      code: constants.ErrorCode
    })
  }
  subscriptionModel.getInfoByUserID(req.session.key.id, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } 
    return res.json({
      success: true,
      msg: "Success",
      code: constants.SuccessCode,
      result:result[0]
    });
  });
}

