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

var canvas, context;
function onLoad(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  GamepadManager.setup();
  onLoop();
}

function onLoop(){
  GamepadManager.update();
  context.clearRect(0, 0, canvas.width, canvas.height);
  result = GamepadManager.getId(0);
  if(result != null){
    context.fillStyle = "#f00";
    context.strokeStyle = "#000";
    for(i in result.buttons){
      if(result.buttons[i].pressed == true || result.buttons[i].value > 0){
        context.fillRect(i*30, 0, 30, 30);
      }
      else{
        context.strokeRect(i*30, 0, 30, 30);
      }
    }
    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI*2);
    context.stroke();
    context.beginPath();
    let valid=(Math.abs(result.axes[0]) + Math.abs(result.axes[1])) > 0.1;
    let direction = 0;
    if(valid){
      direction = Math.atan2(result.axes[1], result.axes[0]);
    }
    if(valid){
      context.arc(100+25*Math.cos(direction), 100+25*Math.sin(direction), 25, 0, Math.PI*2);
    }
    else{
      context.arc(100, 100, 25, 0, Math.PI*2);
    }
    context.fill();

    context.beginPath();
    context.arc(250, 100, 50, 0, Math.PI*2);
    context.stroke();
    context.beginPath();
    valid=(Math.abs(result.axes[5]) + Math.abs(result.axes[2])) > 0.1;
    direction = 0;
    if(valid){
      direction = Math.atan2(result.axes[5], result.axes[2]);
    }
    if(valid){
      context.arc(250+25*Math.cos(direction), 100+25*Math.sin(direction), 25, 0, Math.PI*2);
    }
    else{
      context.arc(250, 100, 25, 0, Math.PI*2);
    }
    context.fill();
  }
  setTimeout(onLoop, 100);
}
