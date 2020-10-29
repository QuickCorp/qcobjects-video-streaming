'use strict';
Package('org.quickcorp.custom.controllers.videostreaming.viewer',[
  Class('VideoViewerController',Controller,{
	  dependencies:[],
	  component:null,
    enableAudio: function () {
      var controller = this;
      console.log("Enabling audio")
      controller.video.muted = false;
    },
	  done:function (){
			var controller = this;
			let peerConnection;
			const config = {
			  iceServers: [
			      {
			        "urls": "stun:stun.l.google.com:19302",
			      }
			      // {
			      //   "urls": "turn:TURN_IP?transport=tcp",
			      //   "username": "TURN_USERNAME",
			      //   "credential": "TURN_CREDENTIALS"
			      // }
			  ]
			};

			const socket = io.connect(window.location.origin);
      global.set("socket",socket);
			controller.video = document.querySelector("video");
			controller.enableAudioButton = document.querySelector("#enable-audio");

			controller.enableAudioButton.addEventListener("click", controller.enableAudio.bind(controller))

			socket.on("offer", (id, description) => {
			  global.set("peerConnection", new RTCPeerConnection(config));
			  global.get("peerConnection")
			    .setRemoteDescription(description)
			    .then(() => global.get("peerConnection").createAnswer())
			    .then(sdp => global.get("peerConnection").setLocalDescription(sdp))
			    .then(() => {
			      socket.emit("answer", id, global.get("peerConnection").localDescription);
			    });
			  global.get("peerConnection").ontrack = event => {
			    controller.video.srcObject = event.streams[0];
			  };
			  global.get("peerConnection").onicecandidate = event => {
			    if (event.candidate) {
			      socket.emit("candidate", id, event.candidate);
			    }
			  };
			});


			socket.on("candidate", (id, candidate) => {
			  global.get("peerConnection")
			    .addIceCandidate(new RTCIceCandidate(candidate))
			    .catch(e => console.error(e));
			});

			socket.on("connect", () => {
			  socket.emit("watcher");
			});

			socket.on("broadcaster", () => {
			  socket.emit("watcher");
			});

			socket.on("disconnectPeer", () => {
			  global.get("peerConnection").close();
			});

			window.onunload = window.onbeforeunload = () => {
			  global.get("socket").close();
			};


	  }
	})
]);
