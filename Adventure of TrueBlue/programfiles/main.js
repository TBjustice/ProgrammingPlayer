var canvas;
var canvassize = [0, 0];
var fieldPolygon;
var characterPolygon;
var WorldMap = new Map();
var characterPos = [0.5, 0.5, 0.5];
//var characterPos = [-33, 12, 1];
var characterV = [0.0, 0.0, 0.0];
var gamestatus = 0;
var startTime;

var LRswitch = false;
var UDswitch = false;

function getLocal(a){
  return a - Math.floor(a);
}

function CreateColorSphere(position, index, r=[0.5, 0.5, 0.5]){
  for (let f1 = 0; f1 <= 50; f1++) {
    let rad = Math.PI * (f1 / 50);
    let ry = Math.cos(rad);
    let rr = Math.sin(rad);
    for (let f2 = 0; f2 <= 50; f2++) {
      var tr = Math.PI * 2 / 50 * f2;
      var tx = rr * r[0] * Math.cos(tr);
      var ty = ry * r[1];
      var tz = rr * r[2] * Math.sin(tr);
      position.push(new Vec3f(tx, ty, tz));
    }
  }
  for (let f1 = 0; f1 < 50; f1++) {
    for (let f2 = 0; f2 < 50; f2++) {
      let bufidx = 51 * f1 + f2;
      index.push(new Vec3i(bufidx, bufidx + 1, bufidx + 52));
      index.push(new Vec3i(bufidx, bufidx + 52, bufidx + 51));
    }
  }
}

function AddBlock(position, uv, index, x, y, z, uvx, uvy, type=1){
  WorldMap.set("" + x + "_" + y + "_" + z, type);
  let offset_I = position.length;

  position.push(new Vec3f( x ,y+1, z ));
  position.push(new Vec3f( x ,y+1,z+1));
  position.push(new Vec3f(x+1,y+1,z+1));
  position.push(new Vec3f(x+1,y+1, z ));
  position.push(new Vec3f( x , y , z ));//4
  position.push(new Vec3f( x , y ,z+1));//5
  position.push(new Vec3f( x , y ,z+1));//5
  position.push(new Vec3f(x+1, y ,z+1));//6
  position.push(new Vec3f(x+1, y ,z+1));//6
  position.push(new Vec3f(x+1, y , z ));//7
  position.push(new Vec3f(x+1, y , z ));//7
  position.push(new Vec3f( x , y , z ));//4

  uv.push(new Vec2f((uvx+0.33)/8,(uvy+0.33)/8));
  uv.push(new Vec2f((uvx+0.33)/8,(uvy+0.67)/8));
  uv.push(new Vec2f((uvx+0.67)/8,(uvy+0.67)/8));
  uv.push(new Vec2f((uvx+0.67)/8,(uvy+0.33)/8));
  uv.push(new Vec2f((uvx+0.00)/8,(uvy+0.33)/8));
  uv.push(new Vec2f((uvx+0.00)/8,(uvy+0.66)/8));
  uv.push(new Vec2f((uvx+0.33)/8,(uvy+1.00)/8));
  uv.push(new Vec2f((uvx+0.66)/8,(uvy+1.00)/8));
  uv.push(new Vec2f((uvx+1.00)/8,(uvy+0.66)/8));
  uv.push(new Vec2f((uvx+1.00)/8,(uvy+0.33)/8));
  uv.push(new Vec2f((uvx+0.66)/8,(uvy+0.00)/8));
  uv.push(new Vec2f((uvx+0.33)/8,(uvy+0.00)/8));

  index.push(new Vec3i(offset_I+0, offset_I+1, offset_I+2));
  index.push(new Vec3i(offset_I+3, offset_I+0, offset_I+2));
  index.push(new Vec3i(offset_I+0, offset_I+4, offset_I+1));
  index.push(new Vec3i(offset_I+1, offset_I+4, offset_I+5));
  index.push(new Vec3i(offset_I+1, offset_I+6, offset_I+2));
  index.push(new Vec3i(offset_I+2, offset_I+6, offset_I+7));
  index.push(new Vec3i(offset_I+2, offset_I+8, offset_I+3));
  index.push(new Vec3i(offset_I+3, offset_I+8, offset_I+9));
  index.push(new Vec3i(offset_I+3, offset_I+10, offset_I+0));
  index.push(new Vec3i(offset_I+0, offset_I+10, offset_I+11));
}

function GetWorld(x, y, z){
  x = Math.floor(x);
  y = Math.floor(y);
  z = Math.floor(z);
  if(WorldMap.has("" + x + "_" + y + "_" + z)){
    return WorldMap.get("" + x + "_" + y + "_" + z);
  }
  else{
    return -1;
  }
}
function canGoThrough(x, y, z){
  let type = GetWorld(x, y, z);
  if(type == -1)return true;
  if(type == 1)return true;
  return false;
}

async function onLoad() {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  GamepadManager.setup();
  canvas = document.getElementById("canvas");
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  gl = canvas.getContext("webgl2");

  camera = new PerspectiveCamera();
  camera.alpha = 180;
  camera.beta = 45;
  camera.cameraLength = 5;

  shader3D.setup();

  await decodeStageFile();
  fieldPolygon = new GLObject();
  position = []
  uv = []
  index = []
  for(data of stageData){
    if(data.length < 6)continue;
    AddBlock(position, uv, index, data[0], data[1], data[2], data[3], data[4], data[5]);
  }
  fieldPolygon.vertex["position"]=position;
  fieldPolygon.vertex["uv"]=uv;
  fieldPolygon.index=index;
  fieldPolygon.setup();
  fieldPolygon.uniform["colorAmbientLight"] = new Vec3f(0.3, 0.3, 0.3);
  fieldPolygon.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
  fieldPolygon.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
  fieldPolygon.uniform["mMatrix"] = new Mat4f();
  fieldPolygon.uniform["textureSrc"] = 0;
  fieldPolygon.uniform["charapos"] = new Vec3f(0.5, 0.5, 0.5);

  characterPolygon = new GLObject();
  position = []
  index = []
  CreateColorSphere(position, index, [0.3, 0.3, 0.3]);
  characterPolygon.vertex["position"]=position;
  characterPolygon.index=index;
  characterPolygon.setup();
  characterPolygon.uniform["colorAmbientLight"] = new Vec3f(0.3, 0.3, 0.3);
  characterPolygon.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
  characterPolygon.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
  characterPolygon.uniform["mMatrix"] = Mat4f.translation(new Vec3f(0.5, 0.5, 0.5));
  characterPolygon.uniform["colorSrc"] = new Vec4f(0.0, 0.0, 1.0, 1.0);


  texture = await loadImageTexture("./image/result.png");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  setClearColor(new Vec4f(0.0, 0.0, 0.0, 0.0));
  setClearDepth();
  enableDepthTest();
  enableCullFace();
  enableBlend();

  onResize();
}

function onResize() {
  let w = document.documentElement.clientWidth;
  let h = document.documentElement.clientHeight;
  canvassize[0] = w;
  canvassize[1] = h;
  canvas.setAttribute("width", ""+canvassize[0]+"px");
  canvas.setAttribute("height", ""+canvassize[1]+"px");
  camera.aspect = w/h;
}

var mouselog=[-1, -1];
function onMouseDown(event){
  mouselog[0] = event.clientX;
  mouselog[1] = event.clientY;
}
function onMouseMove(event){
  if(mouselog[0] != -1 && mouselog[1] != -1){
    camera.alpha -= (event.clientX - mouselog[0])*0.5;
    camera.beta += (event.clientY - mouselog[1])*0.5;
    if(camera.beta > 85)camera.beta = 85;
    if(camera.beta < -85)camera.beta = -85;
    mouselog[0] = event.clientX;
    mouselog[1] = event.clientY;
  }
}
function onMouseUp(event){
  mouselog[0] = -1;
  mouselog[1] = -1;
}

function onLoop(){
  let ground = -1;
  if(getLocal(characterPos[1]) < 0.5){
    ground = GetWorld(characterPos[0], characterPos[1] - 1.0, characterPos[2]);
  }
  if(ground == -1 || ground == 2){
    characterV[0]*=0.98;
    characterV[2]*=0.98;
  }
  else{
    characterV[0]*=0.7;
    characterV[2]*=0.7;
  }
  if(ground == 1 || characterPos[1] < -5){
    characterPos = [0.5, 0.5, 0.5];
    characterV = [0.0, 0.0, 0.0];
  }
  else if(ground == 3){
    document.getElementById("MessageDiv").style.display = "block";
    endTime = performance.now();
    document.getElementById("messageH1").innerText = "Clear!! " + (Math.floor(endTime - startTime)/1000) + "s";
    characterV = [0.0, 0.0, 0.0];
    gamestatus = 2;
  }
  else if(ground == 4){
    characterV[1]=10;
  }
  characterV[1]-=0.25;
  if(characterV[1] < -5){
    characterV[1]=-5;
  }

  GamepadManager.update();
  let gamepad = GamepadManager.getId(0);

  if(gamepad == null){
    gamepad={
      buttons:[{pressed:false}, {pressed:false}, {pressed:false}, {pressed:false}, {pressed:false}, {pressed:false},{pressed:false}],
      axes:[0, 0, 0, 0, 0, 0]
    };
    if(pressedKeys["KeyA"] == true){
      gamepad.axes[0]-=1;
    }
    if(pressedKeys["KeyD"] == true){
      gamepad.axes[0]+=1;
    }
    if(pressedKeys["KeyS"] == true){
      gamepad.axes[1]+=1;
    }
    if(pressedKeys["KeyW"] == true){
      gamepad.axes[1]-=1;
    }
    if(pressedKeys["ArrowLeft"] == true){
      gamepad.axes[2]-=1;
    }
    if(pressedKeys["ArrowRight"] == true){
      gamepad.axes[2]+=1;
    }
    if(pressedKeys["ArrowUp"] == true){
      gamepad.axes[5]+=1;
    }
    if(pressedKeys["ArrowDown"] == true){
      gamepad.axes[5]-=1;
    }
    if(pressedKeys["Space"] == true){
      gamepad.buttons[1].pressed = true;
    }
    if(pressedKeys["KeyZ"] == true){
      gamepad.buttons[4].pressed = true;
    }
    if(pressedKeys["KeyX"] == true){
      gamepad.buttons[6].pressed = true;
    }
  }

  if((Math.abs(gamepad.axes[5]) + Math.abs(gamepad.axes[2])) > 0.1){
    if(LRswitch) camera.alpha += gamepad.axes[2]*2;
    else camera.alpha -= gamepad.axes[2]*2;
    if(UDswitch) camera.beta += gamepad.axes[5]*2;
    else camera.beta -= gamepad.axes[5]*2;
    if(camera.beta > 85)camera.beta = 85;
    if(camera.beta < -85)camera.beta = -85;
  }
  if(gamepad.buttons[4].pressed && (!gamepad.buttons[6].pressed)){
    camera.cameraLength*=1.05;
    if(camera.cameraLength > 15)camera.cameraLength = 15;
  }
  if(gamepad.buttons[6].pressed && (!gamepad.buttons[4].pressed)){
    camera.cameraLength*=0.95;
    if(camera.cameraLength < 3)camera.cameraLength = 3;
  }

  if((Math.abs(gamepad.axes[1]) + Math.abs(gamepad.axes[0])) > 0.1){
    let direction = Math.atan2(gamepad.axes[1], gamepad.axes[0]) - camera.alpha * Math.PI / 180;
    let speed = Math.sqrt(characterV[0]*characterV[0] + characterV[2]*characterV[2]);
    if(speed <= 2){
      if(ground == -1 || ground == 2){
        characterV[0] += Math.cos(direction)*0.1;
        characterV[2] += Math.sin(direction)*0.1;
      }
      else{
        characterV[0] += Math.cos(direction)*0.9;
        characterV[2] += Math.sin(direction)*0.9;
      }
      speed = Math.sqrt(characterV[0]*characterV[0] + characterV[2]*characterV[2]);
      if(speed >= 2){
        let dir = Math.atan2(characterV[2], characterV[0]);
        characterV[0]=Math.cos(dir)*2;
        characterV[2]=Math.sin(dir)*2;
      }
    }
  }

  if(gamepad.buttons[1].pressed){
    if(ground != -1){
      characterV[1] = 5.6;
    }
  }



  newpos = characterPos[0] + characterV[0]*0.030;
  if(0.4 < getLocal(characterPos[0]) && getLocal(characterPos[0]) < 0.7 && getLocal(newpos) > 0.7){
    let localY = getLocal(characterPos[1]);
    if(localY < 0.3){
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0]+1, characterPos[1] - 1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1] - 1, characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0]+1, characterPos[1] - 1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1] - 1, characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
    else if(0.3 < localY && localY < 0.7){
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
    else{
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0]+1, characterPos[1] + 1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1] + 1, characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0]+1, characterPos[1] + 1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1] + 1, characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
  }
  else if(0.3 < getLocal(characterPos[0]) && getLocal(characterPos[0]) < 0.6 && getLocal(newpos) < 0.3){
    let localY = getLocal(characterPos[1]);
    if(localY < 0.3){
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0]-1, characterPos[1] - 1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1] - 1, characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0]-1, characterPos[1] - 1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1] - 1, characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
    else if(0.3 < localY && localY < 0.7){
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
    else{
      let localZ = getLocal(characterPos[2]);
      if(localZ < 0.3){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0]-1, characterPos[1] + 1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1] + 1, characterPos[2] - 1)){
          characterPos[0] = newpos;
        }
      }
      else if(0.3 < localZ && localZ < 0.7){
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2])){
          characterPos[0] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0]-1, characterPos[1] + 1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1] + 1, characterPos[2] + 1)){
          characterPos[0] = newpos;
        }
      }
    }
  }
  else{
    characterPos[0] = newpos;
  }

  newpos = characterPos[2] + characterV[2]*0.030;
  if(0.4 < getLocal(characterPos[2]) && getLocal(characterPos[2]) < 0.7 && getLocal(newpos) > 0.7){
    let localY = getLocal(characterPos[1]);
    if(localY < 0.3){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
    }
    else if(0.3 < localY && localY < 0.7){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
    }
    else{
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] + 1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]+1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]+1)){
          characterPos[2] = newpos;
        }
      }
    }
  }
  else if(0.3 < getLocal(characterPos[2]) && getLocal(characterPos[2]) < 0.6 && getLocal(newpos) < 0.3){
    let localY = getLocal(characterPos[1]);
    if(localY < 0.3){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
    }
    else if(0.3 < localY && localY < 0.7){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
    }
    else{
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1], characterPos[2] - 1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1], characterPos[2]-1) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]-1)){
          characterPos[2] = newpos;
        }
      }
    }
  }
  else{
    characterPos[2] = newpos;
  }


  newpos = characterPos[1] + characterV[1]*0.030;
  if(0.4 < getLocal(characterPos[1]) && getLocal(characterPos[1]) < 0.7 && getLocal(newpos) > 0.7){
    let localZ = getLocal(characterPos[2]);
    if(localZ < 0.3){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
    else if(0.3 < localZ && localZ < 0.7){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
    else{
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]+1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]+1, characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]+1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
  }
  else if(0.3 < getLocal(characterPos[1]) && getLocal(characterPos[1]) < 0.7 && getLocal(newpos) < 0.3){
    let localZ = getLocal(characterPos[2]);
    if(localZ < 0.3){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]-1) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]-1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
    else if(0.3 < localZ && localZ < 0.7){
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2])){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
    else{
      let localX = getLocal(characterPos[0]);
      if(localX < 0.3){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]-1, characterPos[1]-1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else if(0.3 < localX && localX < 0.7){
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
      else{
        if(canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0], characterPos[1]-1, characterPos[2]+1) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]) && canGoThrough(characterPos[0]+1, characterPos[1]-1, characterPos[2]+1)){
          characterPos[1] = newpos;
        }
        else{
          characterV[1]=0;
        }
      }
    }
  }
  else{
    characterPos[1] = newpos;
  }


  characterPolygon.uniform["mMatrix"].element12=characterPos[0];
  characterPolygon.uniform["mMatrix"].element13=characterPos[1];
  characterPolygon.uniform["mMatrix"].element14=characterPos[2];
  camera.center.data[0]=characterPos[0];
  camera.center.data[1]=characterPos[1];
  camera.center.data[2]=characterPos[2];

  onDraw();
  if(gamestatus==1)setTimeout(onLoop, 30);
}

function onDraw(){
  setFramebuffer(null);
  setViewport(canvassize[0], canvassize[1]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  fieldPolygon.uniform["vpMatrix"] = camera.getVPMatrix();
  if(shader3D.textureFlatLightingEx.use()){
    fieldPolygon.uniform["charapos"].data[0]=characterPos[0];
    fieldPolygon.uniform["charapos"].data[1]=characterPos[1];
    fieldPolygon.uniform["charapos"].data[2]=characterPos[2];
    fieldPolygon.onDraw(shader3D.textureFlatLightingEx);
  }

  characterPolygon.uniform["vpMatrix"] = camera.getVPMatrix();
  if(shader3D.colorFlatLighting.use()){
    characterPolygon.onDraw(shader3D.colorFlatLighting);
  }

  gl.flush();
}

var pressedKeys = {};
function onKeyDown(e) {
  pressedKeys[e.code] = true;
}

function onKeyUp(e) {
  pressedKeys[e.code] = false;
}

function onStart(){
  document.getElementById("MessageDiv").style.display = "none";
  gamestatus = 1;
  characterPos = [0.5, 0.5, 0.5];
  characterV = [0.0, 0.0, 0.0];

  LRswitch = document.getElementById("LRswitch").checked;
  UDswitch = document.getElementById("UDswitch").checked;

  startTime = performance.now();
  onLoop();
}
