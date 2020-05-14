'user strict';

require('dotenv').config();

const constants = require('../config/const');
const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel');
const userEventModel = require('../models/userEventModel');

exports.createEvent = function(req,res) {
  const eventslist = req.body.events;
  var eventIDlist = []
  for (var i=0; i<eventslist.length; i++){
    if (!eventIDlist.includes(eventslist[i].eventid)) {
      eventIDlist.push(eventslist[i].eventid);
      const event = new eventModel(eventslist[i]);
      eventModel.getEventByEventId(event.eventid, function(err, result){
        if (err) {
          console.log("error ocurred",err);
          return res.json({
            success: false,
            msg: err.message,
            code: constants.ErrorCode
          });
        } else {
          if (result.length > 0) {
            console.log("err", "Already Exist");
          }else{
            eventModel.createEvent(event, function(err, result){
              if (err) {
                console.log("error ocurred",err);
                return res.json({
                  success: false,
                  msg: err.message,
                  code: constants.ErrorCode
                })
              } 
            });
          }
        }
      });
    }
    const userevent = new userEventModel(req.user[0], eventslist[i], req.body.computer);
      userEventModel.createEvent(userevent, function(err, result){
        if (err) {
          console.log("error ocurred",err);
          return res.json({
            success: false,
            msg: err.message,
            code: constants.ErrorCode
          })
        } 
      });
  }
  userModel.updateEventDate(req.user[0].email, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      return res.json({
        success: true,
        msg: "success",
        code: constants.SuccessCode
      });
    }
  });
}

exports.getEventInfo = function(req,res){
  var eventid = req.body.eventid;
  eventModel.getEventByEventId(eventid, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      if(result.length>0){
        return res.json({
          success: true,
          msg: 'Success',
          code: constants.SuccessCode,
          result: result[0]
        });
      } else {
        return res.json({
          success: false,
          msg: 'There is no Event',
          code: constants.NoRecodeError,
        });
      }
    }
    console.log('success', result);
  });
}

exports.getEventLog = function(req,res){
  var eventid = req.body.eventid;
  userEventModel.getEventLogByEventId(eventid, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      // console.log('success', result);
      for (var i=0; i< result.length; i++){
        var message = new Buffer(result[i].message, 'base64');
        result[i].message = message.toString();
      } 
      return res.json({
        success: true,
        msg: 'Success',
        code: constants.SuccessCode,
        result: result
      });
    } 
  });
}

exports.getEvents = function(req,res){
  var event_type = req.body.eventtype;
  eventModel.getEvents(event_type, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      // console.log('success', result);
      res.send({
        success: true,
        msg: 'Success',
        code: constants.SuccessCode,
        result: result
      });
    } 
  });
}

exports.updateEventScript = function(req,res){
  var eventid = req.body.eventid;
  var script = req.body.script;
  eventModel.updateEventScript(eventid, script, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      res.send({
        success: true,
        msg: 'Success',
        code: constants.SuccessCode,
        result: result
      });
    } 
  });
}
