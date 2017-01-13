var Cylon = require('cylon');
var config =  __dirname + "/vrbox.json";

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'ble', uuid: 'da8b91fa31684c50aa04f5eda56747f6' },
    joystick: { adaptor: 'joystick' },
    keyboard: { adaptor: 'keyboard' }
  },

  devices: {
    controller: { driver: 'dualshock-3', connection: 'bluetooth', config:config},
  },

  work: function(my) {
    ["up", "down", "left", "right", "circle", "return","a", "d", "c"].forEach(function(button) {
      my.controller.on(button + ":press", function() {
        console.log("Button " + button + " pressed.");
      });

      my.controller.on(button + ":release", function() {
        console.log("Button " + button + " released.");
      });
    });

    my.controller.on("left_x:move", function(pos) {
      console.log("Left Stick - X:", pos);
    });

    my.controller.on("right_x:move", function(pos) {
      console.log("Right Stick - X:", pos);
    });

    my.controller.on("left_y:move", function(pos) {
      console.log("Left Stick - Y:", pos);
    });

    my.controller.on("right_y:move", function(pos) {
      console.log("Right Stick - Y:", pos);
    });

    my.keyboard.on('a', function(key) {
   console.log("A PRESSED!");
 });
 
  }
});

Cylon.start();
