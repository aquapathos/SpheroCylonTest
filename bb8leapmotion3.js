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

var DEFAULT_ACC = 20;
var ACC = 60;
var acc = 0;

var handStartPosition = [],
    handStartDirection = [];

var handWasClosedInLastFrame = false;
var lastrollDirection = 0;

var lastDirection = "";

Cylon.robot({
  connections: {
    bluetooth: {
      adaptor: "central",
//      uuid: '312f1375e66d4ecaadaa1488ff9bc902',
//      uuid: '370d741d181e44688173801659a913e5',
      uuid: 'b3f511eb5b9d41689a6f17319db8947d',
      module: "cylon-ble"
    },

    keyboard: { adaptor: "keyboard" },
    leapmotion: { adaptor: "leapmotion" }
  },

  devices: {
    bb8: { driver: "bb8", module: "cylon-sphero-ble" },
    keyboard: { driver: "keyboard", connection: "keyboard" },
    leapmotion: { driver: "leapmotion", connection: "leapmotion" }
  },


  work: function (my) {

    console.log("::START CALIBRATION::");
    my.bb8.startCalibration();
    setTimeout(function() {
      console.log("::FINISH CALIBRATION::");
      my.bb8.finishCalibration();
    }, 5000);

    every((1).second(), function() {
      if (acc > 0)
        my.bb8.roll(ACC,lastrollDirection);
        console.log("lastrollDirection",lastrollDirection);
      });

    my.keyboard.on("right", function () {
        acc = ACC;
        lastrollDirection = (lastrollDirection + 30) % 360;
    });
    my.keyboard.on("left", function () {
        acc = ACC;
        if(lastrollDirection > 30)
            lastrollDirection =  lastrollDirection - 30;
        else
            lastrollDirection = (lastrollDirection + 330) % 360;
    });
    my.keyboard.on("up", function () {
        acc = ACC;
        lastrollDirection = 0;
    });
    my.keyboard.on("down", function () {
        acc = ACC;
        if(lastrollDirection < 180)
            lastrollDirection =  lastrollDirection + 180;
        else
            lastrollDirection =  lastrollDirection - 180;
    });
    my.keyboard.on("space", function () {
        acc = 0;
        ACC = DEFAULT_ACC;
        my.bb8.stop();
        console.log("::START CALIBRATION::");
        my.bb8.startCalibration();
        setTimeout(function() {
        console.log("::FINISH CALIBRATION::");
        my.bb8.finishCalibration();
        }, 5000);
    });
    my.keyboard.on("a", function(){
          ACC += 1;
          console.log("acc:",acc,ACC);
    });
    my.keyboard.on("s", function(){
          ACC -= 1;
          console.log("acc:",acc);
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

          console.log(hand.palmPosition.join(","))
          console.log(hand.direction.join(","))
          console.log(horizontal, vertical, signal,value,acc,lastrollDirection);

          // DIRECTION FRONT/BACK
          if ((Math.abs(hand.palmNormal[0]) < DIRECTION_THRESHOLD) &&
              (Math.abs(hand.palmNormal[2]) > DIRECTION_THRESHOLD)) {
            if (hand.palmNormal[2] < 0) {
              lastrollDirection = 0
              acc = ACC;
              my.bb8.color(0x0000D0);
              console.log("MAE");
            }

            if (hand.palmNormal[2] > 0) {
              lastrollDirection = 180;
              acc = ACC;
              console.log("USHIRO");
              my.bb8.color(0xD00000);
            }
          }

          // DIRECTION LEFT/RIGHT
          if ((Math.abs(hand.palmNormal[2]) < DIRECTION_THRESHOLD) &&
              (Math.abs(hand.palmNormal[0]) > DIRECTION_THRESHOLD))  {
            if (hand.palmNormal[0] < 0) {
              lastrollDirection = 270;
              acc = ACC;
              my.bb8.color(0x00D080);
              console.log("HIDARI");
            }

            if (hand.palmNormal[0] > 0) {
              lastrollDirection = 90;
              acc = ACC;
              my.bb8.color(0xD00D000)
              console.log("MIGI");
            }
          }
        }

        if (!handOpen && !handWasClosedInLastFrame) {
          console.log("handClosed");
          my.bb8.color(0xFF0000);
          acc = 0;
          my.bb8.stop();
        }
        else console.log("Ready");

        handWasClosedInLastFrame = !handOpen;
        handStartPosition = hand.palmPosition;
        handStartDirection = hand.direction;
    });
}
}).start();
