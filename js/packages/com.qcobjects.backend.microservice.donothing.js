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

Package("com.qcobjects.backend.microservice.donothing", [
  Class("Microservice",BackendMicroservice,{
    finishWithBody: function(stream) {},
    done: function () {
      logger.debug("[DO NOTHING]");
    },
    head: function(formData) {
      var microservice = this;
      microservice.done();
    },
    get: function(formData){
      var microservice = this;
      microservice.done();
    },
    post:function (formData){
      var microservice = this;
      microservice.done();
    },
    put: function(formData) {
      var microservice = this;
      microservice.done();
    },
    delete: function(formData) {
      var microservice = this;
      microservice.done();
    },
    connect: function(formData) {
      var microservice = this;
      microservice.done();
    },
    options: function(formData) {
      var microservice = this;
      microservice.done();
    },
    trace: function(formData) {
      var microservice = this;
      microservice.done();
    },
    patch: function(formData) {
      var microservice = this;
      microservice.done();
    }
  })
]);
