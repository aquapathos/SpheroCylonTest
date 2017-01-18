"use strict";

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

Cylon.robot({
  connections: {
    bluetooth: {
      adaptor: "central",
//      uuid: '312f1375e66d4ecaadaa1488ff9bc902',
//      uuid: '370d741d181e44688173801659a913e5',
      uuid: 'b3f511eb5b9d41689a6f17319db8947d',
      module: "cylon-ble"
    },
    joystick: { adaptor: "joystick" },
    keyboard: { adaptor: "keyboard" },
    leapmotion: { adaptor: "leapmotion" }
  },

  devices: {
    controller: { driver:"joystick", config:config },
    bb8: { driver: "bb8", module: "cylon-sphero-ble" },
    keyboard: { driver: "keyboard" },
    leapmotion: { driver: "leapmotion", connection: "leapmotion" }
  },

  work: function (my) {
    var acc = 20;
    console.log("::START CALIBRATION::");
    my.bb8.startCalibration();
    setTimeout(function() {
      console.log("::FINISH CALIBRATION::");
      my.bb8.finishCalibration();
    }, 5000);

    // キーボード操作
    my.keyboard.on("right", function () {
        my.bb8.roll(acc, 90);
    });
    my.keyboard.on("left", function () {
        my.bb8.roll(acc, 270);
    });
    my.keyboard.on("up", function () {
        my.bb8.roll(acc, 0);
    });
    my.keyboard.on("down", function () {
        my.bb8.roll(acc, 180);
    });
    my.keyboard.on("space", function () {
        my.bb8.stop();
        console.log("::START CALIBRATION::");
        my.bb8.startCalibration();
        setTimeout(function() {
        console.log("::FINISH CALIBRATION::");
        my.bb8.finishCalibration();
        }, 5000);
    });
    my.keyboard.on("a", function(){
          acc += 1;
          console.log("acc:",acc);
    });
    my.keyboard.on("s", function(){
          acc -= 1;
          console.log("acc:",acc);
    });

    // GamePad での操作

    ["a", "b","c"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on("a", function(){
            acc += 1;
            console.log("acc:",acc);
      });

      my.controller.on("b", function(){
            acc -= 1;
            console.log("acc:",acc);
      });

      my.controller.on("c", function(){
        my.bb8.stop();
        console.log("::START CALIBRATION::");
        my.bb8.startCalibration();
        setTimeout(function() {
        console.log("::FINISH CALIBRATION::");
        my.bb8.finishCalibration();
        }, 5000);
      });

    });

    my.controller.on("axisX:move", function(value) {
      if(value == -1){
        console.log("Stick 左");
        my.bb8.roll(acc, 90);
      }
      else
      if(value == 1){
        console.log("Stick 右");
        my.bb8.roll(acc, 270);
      }
    });

    my.controller.on("axisY:move", function(value) {
      if(value == -1){
        console.log("Stick 上");
        my.bb8.roll(acc, 0);
        }
      else
      if(value == 1){
        console.log("Stick 下");
        my.bb8.roll(acc, 180);
      }
    });

    my.leapmotion.on("gesture", function(gesture) {
      var type = gesture.type,
          state = gesture.state,
          progress = gesture.progress;

      var stop = (state === "stop");

      if (type === "circle" && stop && progress > CIRCLE_THRESHOLD) {
        if (gesture.normal[2] < 0) {
          {my.bb8.color("red");my.bb8.stop();};
        }
      }
    });

    // Leap Motion
/*
      my.leapmotion.on("hand", function(hand) {
        var signal, value, horizontal, vertical;

        var handOpen = !!hand.fingers.filter(function(f) {
          return f.extended;
        }).length;

        if (handOpen) {
          console.log("handOpen");

          if (handWasClosedInLastFrame) {
            handStartPosition = hand.palmPosition;
            handStartDirection = hand.direction;
          }

          horizontal = Math.abs(handStartDirection[0] - hand.direction[0]),
          vertical = Math.abs(hand.palmPosition[1] - handStartPosition[1]),
          signal = handStartDirection[0] - hand.direction[0],
          value = (horizontal - TURN_TRESHOLD) * TURN_SPEED_FACTOR;
          var magnitude = 3

          console.log(hand.palmPosition.join(","))
          console.log(hand.direction.join(","))
          console.log(horizontal, vertical, signal,value, magnitude);

          // DIRECTION FRONT/BACK
          if ((Math.abs(hand.palmNormal[0]) < DIRECTION_THRESHOLD) &&
              (Math.abs(hand.palmNormal[2]) > DIRECTION_THRESHOLD)) {
            if (hand.palmNormal[2] < 0) {
              my.bb8.roll(Math.floor(5*magnitude), 0);
              my.bb8.color(0x0000D0);
              console.log("MAE");

            }

            if (hand.palmNormal[2] > 0) {
              my.bb8.roll(Math.floor(5*magnitude), 180);
              console.log("USHIRO");
              my.bb8.color(0xD00000);
            }
          }

          // DIRECTION LEFT/RIGHT
          if ((Math.abs(hand.palmNormal[2]) < DIRECTION_THRESHOLD) &&
              (Math.abs(hand.palmNormal[0]) > DIRECTION_THRESHOLD))  {
            if (hand.palmNormal[0] < 0) {
              my.bb8.roll(Math.floor(5*magnitude), 270);
              my.bb8.color(0x00D080);
              console.log("HIDARI");
            }

            if (hand.palmNormal[0] > 0) {
              my.bb8.roll(Math.floor(5*magnitude), 90);
              my.bb8.color(0xD00D000)
              console.log("MIGI");
            }
          }
        }

        if (!handOpen && !handWasClosedInLastFrame) {
          console.log("handClosed");
          my.bb8.color(0xFF0000);
          my.bb8.stop();
        }
        else console.log("Ready");

        handWasClosedInLastFrame = !handOpen;
        handStartPosition = hand.palmPosition;
        handStartDirection = hand.direction;
    });
    */
}
}).start();
