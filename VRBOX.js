"use strict";

var Cylon = require('cylon');
var config = __dirname + "/vrbox.json"

Cylon.robot({
  connections: {
    joystick: { adaptor: "joystick" }
    },

  devices: {
    controller: { driver:"joystick", config:config}
  },

  work: function(my) {

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
    });
  }
});

Cylon.start();
