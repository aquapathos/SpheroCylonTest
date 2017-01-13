var FFI = require('ffi');

var user32 = new FFI.Library('user32', {
  'GetAsyncKeyState': [
    'int32', ['int32']
  ]
});

setInterval(function() {

  for (var i = 0; i < 255; ++i) {
    var state = user32.GetAsyncKeyState(i);
    if ( state == -32767) {
      // i = 押されたキーコード
      console.log(i);
    }
  }

}, 10);
