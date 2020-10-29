# QCObjects Video Streaming

QCObjects Video Streaming App template


## Usage

#### Quick Start

The qcobjects-video-streaming template a quick start point to build a video streaming application using QCObjects and Socket.io.

```shell
    qcobjects create --custom=qcobjects-video-streaming mynewapp
```

#### Config Settings

Create a config.json file in the root directory of your project and add the following settings

```json
{
  "devmode": "debug",
  "documentRoot": "./public/",
  "dataPath": "./data/",
  "relativeImportPath":"js/packages/",
  "backend": {
    "interceptors":[
      {
        "name": "Start Streaming",
        "description": "Start Streaming",
        "microservice": "com.qcobjects.cloud.backend.videostreaming",
        "responseHeaders": {}
      }
    ],
    "routes": [
      {
        "name": "Socket IO",
        "description": "Socket IO",
        "path": "^/socket.io/(.*)$",
        "microservice": "com.qcobjects.backend.microservice.donothing",
        "redirect_to": "./node_modules/socket.io-client/dist/$1",
        "supported_methods": ["GET","POST","PUT"]
      }
    ]
  },
  "iceServers": [{
    "urls": "stun:stun.l.google.com:19302"
  }]

}
```

#### Set dependencies

In your package.json file add the following dependencies

```json
"dependencies": {
  "qcobjects": "latest",
  "socket.io": "^2.3.0"
},

```

Read more:

[QCObjects](https://qcobjects.com)
