var Cylon = require('cylon');
var config =  __dirname + "/vrbox.json";

    Cylon.robot({
      connections: {
        keyboard: { adaptor: 'keyboard' }
      },

      devices: {
        keyboard: { driver: 'keyboard' }
      },

      work:

      function(my) {
        ["a", "b", "c", "d","e","f"].forEach(function(key){
            my.keyboard.on(key, function(key) {
          console.log(key," PRESSED!");
        });
      })
    }
  }).start();
