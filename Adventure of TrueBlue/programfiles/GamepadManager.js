const GamepadManager={
  gamepads: {},
  setup: function(){
    window.addEventListener("gamepadconnected", this.onConnected);
    window.addEventListener("gamepaddisconnected", this.onDisconnected);
  },
  onConnected: function(e){
    GamepadManager.gamepads[e.gamepad.index] = e.gamepad;
  },
  onDisconnected: function(e){
    delete GamepadManager.gamepads[e.gamepad.index];
  },
  btnPressed: function(btn){return(typeof(btn)=="object"?btn.pressed:btn==1.0);},
  update: function(){
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (gamepads[i].index in this.gamepads) {
          this.gamepads[gamepads[i].index] = gamepads[i];
        }
      }
    }
  },
  getId: function(index){
    let ids = Object.keys(this.gamepads);
    if(index < ids.length){
      return this.gamepads[ids[index]];
    }
    return null;
  }
};
