var GamePad = require( 'node-gamepad' );
var controller = new GamePad( 'ps3/dualshock3' );
controller.connect();

controller.on( 'up:press', function() {
    console.log( 'up' );
} );
controller.on( 'down:press', function() {
    console.log( 'down' );
} );
