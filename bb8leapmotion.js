"use strict";

var Cylon = require("cylon");
var Victor = require("victor");
// var HandPosition =[0,0,0];

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
    var acc = 10;
    console.log("::START CALIBRATION::");
    my.bb8.startCalibration();
    setTimeout(function() {
      console.log("::FINISH CALIBRATION::");
      my.bb8.finishCalibration();
    }, 5000);
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
    });
    my.keyboard.on("a", function(){
          acc += 1;
          console.log("acc:",acc);
    });
    my.keyboard.on("s", function(){
          acc -= 1;
          console.log("acc:",acc);
    });
    /*
    my.keyboard.on("c", function(){
          console.log("startCalibration:");
          my.bb8.startCalibration();
    });
    my.keyboard.on("h", function(){
          console.log("setHeading:");
          my.bb8.setHeading();
    });
    */



    my.leapmotion.on("hand", function (hand) {
        var handOpen = !!hand.fingers.filter(function (f) {
            return f.extended;
        }).length;  // 指の数が０以外であるかどうか => handOpen

        if (handOpen) {
                var delta = new Victor(-hand.palmPosition[2],hand.palmPosition[0]);
                var angle = Math.floor(delta.angle()/Math.PI*2+0.5)*90;
                if(angle < 0) angle += 360;
                console.log("Angle:", angle);
                var magnitude = Math.floor(delta.length());
                var color = 0x0000FF;
                if(hand.palmPosition[1]/2<256){
                  after(5,()=>{
                  color = Math.floor(0x0000FF - hand.palmPosition[1]/2);
                  console.log("color:", color);
                  my.bb8.color(color);});
                }
                if (magnitude < 90) {
                    after(10,()=>{my.bb8.roll(Math.floor(5*magnitude/30), angle);})
                }
                else
                  if (magnitude >= 90)
                    after(10,()=>{my.bb8.roll(15, angle);});
        }
        else {
            after(10,()=>{my.bb8.color("red");my.bb8.stop();});
        };
    });
  }
}).start();
