"use strict";
"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: {
      adaptor: "central",
      uuid: '3f0379883e424b40be8bab59f2c0d4cb',
      module: "cylon-ble"
    }
  },

  devices: {
    ollie: { driver: "ollie", module: "cylon-sphero-ble" }
  },

  work: function(my) {
    my.ollie.color(0xFF0000);
    after((1).second(), function() {
      my.ollie.spin("left", 200);
    });
    after((5).seconds(), function() {
      my.ollie.spin("right", 200);
    });
    after((10).seconds(), function() {
      my.ollie.stop();
    });
    after((12).seconds(), function() {
      my.ollie.color(0x0000FF);
    });
  }
}).start();var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: {
      adaptor: "central",
      uuid: process.env.ADDRESS,
      module: "cylon-ble"
    }
  },

  devices: {
    ollie: { driver: "ollie", module: "cylon-sphero-ble" }
  },

  work: function(my) {
    my.ollie.color(0xFF0000);
    after((1).second(), function() {
      my.ollie.spin("left", 200);
    });
    after((5).seconds(), function() {
      my.ollie.spin("right", 200);
    });
    after((10).seconds(), function() {
      my.ollie.stop();
    });
    after((12).seconds(), function() {
      my.ollie.color(0x0000FF);
    });
  }
}).start();
