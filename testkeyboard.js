"use strict";

var Cylon = require("cylon");
var config = __dirname + "/vrbox.json"

Cylon.robot({
  connections: {
    joystick: { adaptor: "joystick"},
    keyboard: { adaptor: "keyboard" }
  },

  devices: {
    controller: { driver:"joystick", config:config},
    keyboard: { driver: "keyboard", connection: "keyboard" },
  },

  work: function (my) {


    ["a", "b","d", "c"].forEach(function(button) {
      my.joystick.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });
    });

    my.keyboard.on("space", function () {
        console.log("SPACE",config);
    });
}

}).start();
