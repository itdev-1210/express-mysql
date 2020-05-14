'user strict';

var fs = require('fs');
const path = require("path");
var formidable = require('formidable');

const constants = require('../config/const');
const fileModel = require('../models/fileModel');

exports.creatFile = function(req,res,next) {
  var version;
  var description;
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    version = fields.file_version;
    description = fields.description;
    const file = new fileModel(version, description);
    fileModel.getFileByVersion(version, function(err, result){
      if (err) {
        return res.json({
          success: false,
          msg: err.message,
          code: constants.ErrorCode
        });
      } else {
        if (result.length > 0) {
          req.fields = fields;
          req.files = files;
          next();
        }else{
          fileModel.createFile(file, function(err, result){
            if (err) {
              console.log("error ocurred",err);
              return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode
              });
            }
            req.fields = fields;
            req.files = files;
            next();
          });
        }
      }
    });
  });
  }

  exports.getFileByVersion = function(req,res){
    var version = req.body.version;
    fileModel.getFileByVersion(version, function(err, result){
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

  exports.getLastVersion = function(req,res){
    fileModel.getLastVersion(function(err, result){
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

exports.download = function(req, res) {
  var version = req.body.version
  var file = path.join(__dirname, '../public/uploads/'+version+'_justrebootit.rar')
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
}

exports.uploadfile = function(req, res) {
  var files = req.files;
  var fields = req.fields;
  var oldpath = files.fileupload.path;
  var newpath = path.join(__dirname, "../public/uploads/"+fields.file_version+"_justrebootit.rar");
  fs.readFile(oldpath, function (err, data) {
    if (err) {
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode,
      });
    }
    console.log('File read!');
    fs.writeFile(newpath, data, function (err) {
        if (err) {
          return res.json({
            success: false,
            msg: err.message,
            code: constants.ErrorCode,
          });
        }
        fs.unlink(oldpath, function (err) {
          if (err) {
            return res.json({
              success: false,
              msg: err.message,
              code: constants.ErrorCode,
            });
          }
          return res.json({
            success: true,
            msg: "success",
            code: constants.SuccessCode
          });
        });
      });
    });
};
