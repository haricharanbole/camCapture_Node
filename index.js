const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const NodeWebcam = require("node-webcam");

var opts = {
  width: 640,
  height: 320,
  quality: 300,
  output: "jpeg",
  device: false,
  callbackReturn: "base64",
  verbose: false,
  saveShots: false
};

const FPS = 1;
var Webcam = NodeWebcam.create(opts);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

setInterval(() => {
  Webcam.capture(
    "image",
    (err, imgData) => {
      io.emit("image", imgData);
      console.log("Event Emitted");
    },
    opts
  );
}, 1000 / FPS);

server.listen(3000);
