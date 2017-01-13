"use strict";

var Cylon = require('cylon');
var config = __dirname + "/vrbox.json"

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'ble', uuid: 'da8b91fa31684c50aa04f5eda56747f6' },
    joystick: { adaptor: "joystick" },
    keyboard: { adaptor: "keyboard" }
  },

  devices: {
    controller: { driver:"joystick", config:config}
  },

  work: function(my) {

    console.log("CONFIG",config);

    ["a", "b","d", "c"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on(button + ":release", function() {
        console.log("Button " + button + " released.");
      });
    });

    my.controller.on("axisX:move", function(value) {
      console.log("Stick - X:", value);
    });

    my.controller.on("axisY:move", function(value) {
      console.log("Stick - X:", value);
    });a

  }
});

Cylon.start();
