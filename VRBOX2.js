"use strict";
var gamepad = require("gamepad");

// Initialize the library
var Cylon = require("cylon");
var Victor = require("victor");
// var HandPosition =[0,0,0];

var TURN_TRESHOLD = 0.2,
    TURN_SPEED_FACTOR = 2.0;

var DIRECTION_THRESHOLD = 0.25,
    DIRECTION_SPEED_FACTOR = 0.05;

var UP_CONTROL_THRESHOLD = 50,
    UP_SPEED_FACTOR = 0.01,
    CIRCLE_THRESHOLD = 1.5;

var handStartPosition = [],
    handStartDirection = [];

var handWasClosedInLastFrame = false;
var config = __dirname + "/vrbox.json"

gamepad.init()
// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

/*
// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  console.log("move", {
    id: id,
    axis: axis,
    value: value,
  });
});

// Listen for button up events on all gamepads
gamepad.on("up", function (id, num) {
  console.log("up", {
    id: id,
    num: num,
  });
});

// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  console.log("down", {
    id: id,
    num: num,
  });
});
*/

Cylon.robot({
  connections: {
//    joystick: { adaptor: "joystick",port: "/dev/tty.Bluetooth-Incoming-Port"},
    bluetooth: {
      adaptor: "central",
//      uuid: '312f1375e66d4ecaadaa1488ff9bc902',
//      uuid: '370d741d181e44688173801659a913e5',
      uuid: 'b3f511eb5b9d41689a6f17319db8947d',
      module: "cylon-ble"
    }
    },

  devices: {
//    controller: { driver:"joystick", config:config},
    bb8: { driver: "bb8", module: "cylon-sphero-ble" }
  },

  work: function(my) {
    var acc = 60;
    console.log("::START CALIBRATION::");
    my.bb8.startCalibration();
    setTimeout(function() {
      console.log("::FINISH CALIBRATION::");
      my.bb8.finishCalibration();
    }, 5000);

    gamepad.on("move", function (id, axis, value) {
      console.log("move", {
        id: id,
        axis: axis,
        value: value,
      });
      if(id==0 && axis==1)
        if(value == -1)
          my.bb8.roll(acc, 0);
        else if (value == 1)
          my.bb8.roll(acc, 180);
      if(id==0 && axis==0)
        if(value == -1)
          my.bb8.roll(acc, 270);
        else if (value == 1)
          my.bb8.roll(acc, 90);
    });

/*
    ["a", "b","d", "c"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on(button + ":release", function() {
        console.log("Button " + button + " released.");
      });
    });

    my.controller.on("axisX:move", function(value) {
      if(value == -1)
        console.log("Stick 左");
      else
      if(value == 1)
        console.log("Stick 右");
    });

    my.controller.on("axisY:move", function(value) {
      if(value == -1)
        console.log("Stick 上");
      else
      if(value == 1)
        console.log("Stick 下");
    });*/
  }
});

Cylon.start();
