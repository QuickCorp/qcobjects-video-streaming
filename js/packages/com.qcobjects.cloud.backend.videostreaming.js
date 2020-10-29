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

Package("com.qcobjects.cloud.backend.videostreaming", [
  Class("Interceptor", Object, {
    domain: CONFIG.get("domain"),
    basePath: CONFIG.get("basePath"),
    body: null,
    stream: null,
    request: null,
    videoStreaming: function(formData) {
      let microservice = this;

      if (!global.get("VideoStreamingStarted", false)) {
        try {
          logger.debug("Loading socket.io settings...");

          if (typeof microservice.server !== "undefined"){
            logger.debug("Attaching socket.io to server...");

            const io = require("socket.io")(microservice.server);

            io.sockets.on("error", e => {
              logger.debug("[QCObjects][Socket.io] Error" + e.toString());
              console.log(e);
              return;
            });
            io.sockets.on("connection", socket => {
              socket.on("broadcaster", () => {
                logger.debug("Socket is starting...");
//                global.set("VideoStreamingStarted", true);
                global.set("broadcaster", socket.id);
                socket.broadcast.emit("broadcaster");
              });
              socket.on("watcher", () => {
                socket.to(global.get("broadcaster")).emit("watcher", socket.id);
              });
              socket.on("offer", (id, message) => {
                socket.to(id).emit("offer", socket.id, message);
              });
              socket.on("answer", (id, message) => {
                socket.to(id).emit("answer", socket.id, message);
              });
              socket.on("candidate", (id, message) => {
                socket.to(id).emit("candidate", socket.id, message);
              });
              socket.on("disconnect", () => {
                socket.to(global.get("broadcaster")).emit("disconnectPeer", socket.id);
              });
            });

          } else {
            logger.debug("Server is not loaded");
          }


        } catch (e){
          logger.debug("[QCObjects][Socket.io] Something went wrong while trying to create a socket...");
          logger.debug(e.toString());
        }

      } else {
        logger.debug("Socket is already started...");
      }

    },
    _new_: function(o) {
      logger.debug("Executing BackendInterceptor ");
      let microservice = this;
      microservice.body = null;
      let request = microservice.request;
  //    this.cors();
      let stream = o.stream;
      microservice.stream = stream;
      microservice.videoStreaming();


    }
  })
]);
