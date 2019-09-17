const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const NodeWebcam = require("node-webcam");
var Jimp = require("jimp");

var opts = {
  width: 640,
  height: 320,
  quality: 300,
  output: "bmp",
  device: false,
  callbackReturn: "base64",
  verbose: false,
  saveShots: false
};

const FPS = 1;
var count = "init";

var Webcam = NodeWebcam.create(opts);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

setInterval(() => {
  Webcam.capture(
    "image",
    (err, imgData) => {
      io.emit("image", imgData);
      console.log(count);
      if (count === 10 || count === "init") {
        Jimp.read("image.bmp", (err, lenna) => {
          if (err) throw err;
          lenna
            .resize(640, 320) // resize
            .quality(100) // set JPEG quality
            .write("out.jpg"); // save
        });
        count = 0;
      }
      count = count + 1;
      console.log("Event Emitted");
    },
    opts
  );
}, 1000 / FPS);

server.listen(3000);
