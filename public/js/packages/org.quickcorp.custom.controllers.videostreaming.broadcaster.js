'use strict';
Package('org.quickcorp.custom.controllers.videostreaming.broadcaster',[
  Class('VideoBroadcasterController',Controller,{
	  dependencies:[],
	  component:null,
    getDevices: function () {
      return navigator.mediaDevices.enumerateDevices();
    },
    gotDevices: function (deviceInfos) {
      var controller = this;
      window.deviceInfos = deviceInfos;
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          option.text = deviceInfo.label || `Microphone ${controller.audioSelect.length + 1}`;
          controller.audioSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `Camera ${controller.videoSelect.length + 1}`;
          controller.videoSelect.appendChild(option);
        }
      }
    },
    getStream: function () {
      var controller = this;
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      const audioSource = controller.audioSelect.value;
      const videoSource = controller.videoSelect.value;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(controller.gotStream.bind(controller))
        .catch(controller.handleError.bind(controller));
    },
    gotStream: function (stream) {
      var socket = global.get("socket");
      var controller = this;
      controller.videoElement = document.querySelector("video");
      controller.audioSelect = document.querySelector("select#audioSource");
      controller.videoSelect = document.querySelector("select#videoSource");

      window.stream = stream;
      controller.audioSelect.selectedIndex = [...controller.audioSelect.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
      );
      controller.videoSelect.selectedIndex = [...controller.videoSelect.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
      );
      controller.videoElement.srcObject = stream;
      socket.emit("broadcaster");
    },
    handleError: function (error) {
      console.error("Error: ", error);
    },
	  done:function (){
			var controller = this;
      global.set("peerConnections",{});
      var config = {
        iceServers: [
          {
            "urls": "stun:stun.l.google.com:19302",
          },
          // {
          //   "urls": "turn:TURN_IP?transport=tcp",
          //   "username": "TURN_USERNAME",
          //   "credential": "TURN_CREDENTIALS"
          // }
        ]
      };

      var socket = io.connect(window.location.origin);
      global.set("socket",socket);

      socket.on("answer", (id, description) => {
        global.get("peerConnections")[id].setRemoteDescription(description);
      });

      socket.on("watcher", id => {
        global.set("peerConnection", new RTCPeerConnection(config));
        global.get("peerConnections")[id] = global.get("peerConnection");

        let stream = controller.videoElement.srcObject;
        stream.getTracks().forEach(track => global.get("peerConnection").addTrack(track, stream));

        global.get("peerConnection").onicecandidate = event => {
          if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
          }
        };

        global.get("peerConnection")
          .createOffer()
          .then(sdp => global.get("peerConnection").setLocalDescription(sdp))
          .then(() => {
            socket.emit("offer", id, global.get("peerConnection").localDescription);
          });
      });

      socket.on("candidate", (id, candidate) => {
        global.get("peerConnections")[id].addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("disconnectPeer", id => {
        global.get("peerConnections")[id].close();
        delete global.get("peerConnections")[id];
      });

      window.onunload = window.onbeforeunload = () => {
        socket.close();
      };

      // Get camera and microphone
      controller.videoElement = document.querySelector("video");
      controller.audioSelect = document.querySelector("select#audioSource");
      controller.videoSelect = document.querySelector("select#videoSource");

      controller.audioSelect.onchange = controller.getStream.bind(controller);
      controller.videoSelect.onchange = controller.getStream.bind(controller);

      controller.getStream()
        .then(controller.getDevices.bind(controller))
        .then(controller.gotDevices.bind(controller));



	  }
	})
]);
