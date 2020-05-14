'user strict';

const constants = require('../config/const');
const applicationModel = require('../models/applicationModel');

exports.creatApplication = function(req,res) {
  var application = new applicationModel(req.body);
  applicationModel.getAppllicationByNameVersion(req.body.name, req.body.version, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      });
    } else {
      if (result.length > 0) {
        return res.json({
          success: false,
          msg: 'This version already exists.',
          code: constants.EmailExistError
        });
      }else{
        applicationModel.creatApplication(application, function(err, result){
          if (err) {
            console.log("error ocurred",err);
            return res.json({
              success: false,
              msg: err.message,
              code: constants.ErrorCode
            });
          }
          return res.json({
            success: true,
            msg: "success",
            code: constants.SuccessCode
          }); 
        });
      }
    }
  });
}

exports.getAllApplication = function(req,res){
  applicationModel.getAllApplication(function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      });
    } else {
        return res.json({
          success: true,
          msg: 'Success',
          code: constants.SuccessCode,
          result: result
        });
    }
    console.log('success', result);
  });
};

exports.getApplicationByID = function(req,res){
  var id = req.body.id
  applicationModel.getAppllicationByID(id, function(err, result){
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
          msg: 'Success',
          code: constants.SuccessCode,
          result: result[0]
        });
    }
    console.log('success', result);
  });
}

exports.getApplicationByNameVersion = function(req,res){
  var version = req.body.version;
  var name = req.body.name;
  applicationModel.getAppllicationByNameVersion(name, version, function(err, result){
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
          msg: 'There is no file',
          code: constants.NoRecodeError,
        });
      }
    }
    console.log('success', result);
  });
}

exports.searchByName = function(req,res){
  var name = req.body.name;
  applicationModel.searchByName(name, function(err, result){
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
      }
        return res.json({
          success: false,
          msg: 'Empty',
          code: constants.EmailExistError,
        });
    }
    console.log('success', result);
  });
}

exports.updateApplication = function(req,res){
  var application = new applicationModel(req.body);
  applicationModel.updateApplication(req.body.id, application, function(err, result){
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
        msg: 'Success',
        code: constants.SuccessCode,
        result: result
      });
    }
    console.log('success', result);
  });
}


