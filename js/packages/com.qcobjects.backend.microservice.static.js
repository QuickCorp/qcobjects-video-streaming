/**
 * QCObjects CLI 0.1.x
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
/*eslint no-useless-escape: "off"*/
"use strict";
const fs = require("fs");
const path = require("path");
const absolutePath = path.resolve(__dirname, "./");
const mime = require("mime");

Package("com.qcobjects.backend.microservice.static", [
  Class("Microservice",BackendMicroservice,{
    finishWithBody: function(stream) {},
    done: function () {
      // read and send file content in the stream

      let microservice = this;
      let stream = microservice.stream;
      let fileName = `${process.cwd()}/${microservice.fileName}`;
      try {
        logger.info(`Delivering static file... ${fileName}`);
        const fd = fs.openSync(fileName, "r");
        const stat = fs.fstatSync(fd);
        const headers = {
          "content-length": stat.size,
          "last-modified": stat.mtime.toUTCString(),
          "content-type": mime.getType(fileName)
        };
        console.log(fd);
        try {
          stream.respondWithFD(fd, headers);
        } catch (e){
          logger.debug("Something went wrong while sending headers...");
        }
        stream.on("close", () => {
          logger.info("closing file "+ fileName);
          fs.closeSync(fd);
        });
        stream.end();

      } catch (e){
        logger.debug("ERROR NOT FOUND");
        console.log(e);
        if (e.errno==-2){
          const headers = {
            ":status": 404,
            "content-type": "text/html"
          };
          stream.write("<h1>404 - FILE NOT FOUND</h1>");
          stream.on("close", () => {
            logger.debug("file not found "+ fileName);
            logger.info("closing file "+ fileName);
          });
          stream.end();
        } else {
          console.log(e);
          const headers = {
            ":status": 500,
            "content-type": "text/html"
          };
          stream.write("<h1>500 - INTERNAL ERROR</h1>");
          stream.on("close", () => {
            logger.debug("internal error "+ fileName);
            logger.info("closing file "+ fileName);
          });
          stream.end();
        }
      }
    },
    static: function (method,data){
      var microservice = this;
      var redirect_to = microservice.route.redirect_to;
      return new Promise (function (resolve,reject){
        var supported_methods = microservice.route.supported_methods;
        var _method_allowed_ = false;
        if (typeof supported_methods !== "undefined"){
          if (supported_methods =="*" || (typeof method == "undefined") || [...supported_methods].map(m=>m.toLowerCase()).indexOf(method.toLowerCase())!== -1){
            _method_allowed_ = true;
          }
        } else {
          _method_allowed_ = true;
        }

        logger.debug("Starting static delivery microservice call for method: "+method);
        if (_method_allowed_){
          logger.info("I'm going to deliver a static path...");
          if (redirect_to){
            let request_path = microservice.request.path;
            let re = (new RegExp(microservice.route.path.replace( /{(.*?)}/g,"\(\?\<$1\>\.\*\)" ),"g"));
            microservice.fileName  = request_path.replace(re,microservice.route.redirect_to);
            try {
              resolve();
            } catch (e){
              console.log("\u{1F926} Something went wrong \u{1F926} when trying to deliver a static path: "+microservice.fileName);
              reject();
            }
          } else {
            logger.info("There is no redirect_to setting declared in route properties. \n Skipping static delivery...");
            reject();
          }
        } else {
          logger.debug("Method: "+method+" will be skipped");
          resolve();
        }

      });
    },
    head: function(formData) {
      var microservice = this;
      microservice.static("head",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    get: function(formData){
      var microservice = this;
      microservice.static("get",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    post:function (formData){
      var microservice = this;
      microservice.static("post",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    put: function(formData) {
      var microservice = this;
      microservice.static("put",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    delete: function(formData) {
      var microservice = this;
      microservice.static("delete",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    connect: function(formData) {
      var microservice = this;
      microservice.static("connect",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    options: function(formData) {
      var microservice = this;
      microservice.static("options",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    trace: function(formData) {
      var microservice = this;
      microservice.static("trace",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    },
    patch: function(formData) {
      var microservice = this;
      microservice.static("patch",formData).then(response=>{
        microservice.body=response;
        microservice.done();
      });
    }
  })
]);
