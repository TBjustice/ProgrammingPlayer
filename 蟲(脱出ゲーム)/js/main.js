var images = {};
var canvas1, div_textInput, div_yesnoInput, div_colorInput, div_textMessage, h2_message, div_imgMessage;
var is_dead="NO";

function appendImage(name){
  var imagebuf = new Image();
  imagebuf.src = "image/" + name + ".png";
  images[name] = imagebuf;
}

function onLoad(){
  if(localStorage.hasOwnProperty('savedData')){
    var data = localStorage.getItem('savedData');
    data = JSON.parse(data);
    for (var key in data) {
      MyVariable[key] = data[key];
    }
  }
  document.getElementById("gold").innerText = "所持している金貨の枚数:" + MyVariable["Gold"];
  canvas1 = document.getElementById('canvas1');
  div_textInput = document.getElementById('textInput');
  div_textInput.style.display = "none";
  div_yesnoInput = document.getElementById('yesnoInput');
  div_yesnoInput.style.display = "none";
  div_colorInput = document.getElementById('colorInput');
  div_colorInput.style.display = "none";
  div_textMessage = document.getElementById('textMessage');
  div_textMessage.style.display = "none";
  h2_message = document.getElementById('message');
  div_imgMessage = document.getElementById('imgMessage');
  div_imgMessage.style.display = "none";


  appendImage("black");
  appendImage("personD1");
  appendImage("personD2");
  appendImage("personD3");
  appendImage("personU1");
  appendImage("personU2");
  appendImage("personU3");
  appendImage("personR1");
  appendImage("personR2");
  appendImage("personR3");
  appendImage("personL1");
  appendImage("personL2");
  appendImage("personL3");
  appendImage("personAXE");
  appendImage("personSpider");
  appendImage("personBlack");

  appendImage("spiderR");
  appendImage("spiderL");
  appendImage("spiderD");
  appendImage("spiderU");

  appendImage("knifeinGrassFloor");
  appendImage("roseWall");

  appendImage("stoneFloor");
  appendImage("woodFloor");
  appendImage("stoneWall");

  appendImage("flowerR");
  appendImage("flowerY");
  appendImage("flowerB");
  appendImage("sandFloor");
  appendImage("grassFloor1");
  appendImage("grassFloor2");
  appendImage("grassFloor3");
  appendImage("stoneWallATstart");
  appendImage("woodDoor");
  appendImage("stoneFloorPass");
  appendImage("stoneFloorPass2");
  appendImage("statueNE");
  appendImage("statueNW");
  appendImage("statueSE");
  appendImage("statueSW");
  appendImage("puzzleLEFT");
  appendImage("puzzleRIGHT");
  appendImage("puzzleUP");
  appendImage("puzzleDOWN");
  appendImage("passwordInput1");
  appendImage("passwordInput2");
  appendImage("passwordInput4");
  appendImage("stoneFloorBlood");
  appendImage("stoneFloorBurning");
  appendImage("stoneFloorDot");
  appendImage("stoneFloorWithButton");
  appendImage("stoneFloorWithButton2");
  appendImage("stoneWallSwitchOff");
  appendImage("stoneWallSwitchOn");

  appendImage("fountain");

  appendImage("StoneFloor_Circle");
  appendImage("stoneFloor_Triangle");
  appendImage("stoneFloor_Square");
  appendImage("PaperStoneFloor");

  appendImage("kamakiritrap");
  appendImage("kamakiritrap2");

  appendImage("stoneWallPaper");
  appendImage("lasthint");

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  window.addEventListener("click", onClick);
  window.addEventListener("contextmenu", onContextMenu);

  setTimeout(onLoop, 1000);
}

var count = 0;
var nowstate = 2;
var gameclear = false;
function onLoop(){
  if(nowstate > 0)nowstate = -nowstate;
  if(!onInteract() && is_dead == "NO"){
    if(gameclear) return;
    count++;
    count %= 120;
    if(pressedKeys["up"]){
      nowstate = 1;
      var chX2 = Math.floor(MyVariable["chX"]/10 + 0.8);
      var chY2 = Math.floor(MyVariable["chY"]/10 + 0.2);
      var placekey = (7+chX2) + "," + (7-chY2);
      chX2 = Math.floor(MyVariable["chX"]/10 + 0.2);
      chY2 = Math.floor(MyVariable["chY"]/10 + 0.2);
      var placekey2 = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA && placekey2 in MAPDATA){
        if(CHIPDATA[MAPDATA[placekey]].canGoThrough() && CHIPDATA[MAPDATA[placekey2]].canGoThrough()){
          MyVariable["chY"]+=2;
        }
      }
    }
    else if(pressedKeys["down"]){
      nowstate = 2;
      var chX2 = Math.floor(MyVariable["chX"]/10 + 0.8);
      var chY2 = Math.floor(MyVariable["chY"]/10 - 0.2);
      var placekey = (7+chX2) + "," + (7-chY2);
      chX2 = Math.floor(MyVariable["chX"]/10 + 0.2);
      chY2 = Math.floor(MyVariable["chY"]/10 - 0.2);
      var placekey2 = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA && placekey2 in MAPDATA){
        if(CHIPDATA[MAPDATA[placekey]].canGoThrough() && CHIPDATA[MAPDATA[placekey2]].canGoThrough()){
          MyVariable["chY"]-=2;
        }
      }
    }
    else if(pressedKeys["left"]){
      nowstate = 3;
      var chX2 = Math.floor(MyVariable["chX"]/10 - 0.2 + 0.2);
      var chY2 = Math.floor(MyVariable["chY"]/10);
      var placekey = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA){
        if(CHIPDATA[MAPDATA[placekey]].canGoThrough()){
          MyVariable["chX"]-=2;
        }
      }
    }
    else if(pressedKeys["right"]){
      nowstate = 4;
      var chX2 = Math.floor(MyVariable["chX"]/10 + 0.2 + 0.8);
      var chY2 = Math.floor(MyVariable["chY"]/10);
      var placekey = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA){
        if(CHIPDATA[MAPDATA[placekey]].canGoThrough()){
          MyVariable["chX"]+=2;
        }
      }
    }
    if(pressedKeys["space"]){
      var chX2 = Math.floor(MyVariable["chX"]/10 + 0.5);
      var chY2 = Math.floor(MyVariable["chY"]/10);
      var placekey = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA){
        if(!CHIPDATA[MAPDATA[placekey]].searched()){
          switch (nowstate) {
            case 1:
            case -1:
            chX2 = Math.floor(MyVariable["chX"]/10 + 0.5);
            chY2 = Math.floor(MyVariable["chY"]/10 + 1);
            placekey = (7+chX2) + "," + (7-chY2);
            break;
            case 2:
            case -2:
            chX2 = Math.floor(MyVariable["chX"]/10 + 0.5);
            chY2 = Math.floor(MyVariable["chY"]/10 - 1);
            placekey = (7+chX2) + "," + (7-chY2);
            break;
            case 3:
            case -3:
            chX2 = Math.floor(MyVariable["chX"]/10 - 0.5);
            chY2 = Math.floor(MyVariable["chY"]/10);
            placekey = (7+chX2) + "," + (7-chY2);
            break;
            case 4:
            case -4:
            chX2 = Math.floor(MyVariable["chX"]/10 + 1.5);
            chY2 = Math.floor(MyVariable["chY"]/10);
            placekey = (7+chX2) + "," + (7-chY2);
            break;
            default:
          }
          if(placekey in MAPDATA){
            if(!CHIPDATA[MAPDATA[placekey]].searched()){
              addMessage("特に気になる物はない");
            }
          }
          else{
            addMessage("特に気になる物はない");
          }
        }
      }
    }

    //*****
    if(true){
      var chX2 = Math.floor(MyVariable["chX"]/10 + 0.5);
      var chY2 = Math.floor(MyVariable["chY"]/10 + 0.01);
      var placekey = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA){
        CHIPDATA[MAPDATA[placekey]].stepped();
      }
    }
    //*****
  }
  draw();
  setTimeout(onLoop, 40);
}

function draw() {
  var context = canvas1.getContext('2d');
  var chX2 = Math.floor(MyVariable["chX"]/10);
  var chY2 = Math.floor(MyVariable["chY"]/10);
  for(var x=-1; x<16; x++){
    for(var y=-1; y<16; y++){
      var placekey = (x+chX2) + "," + (y-chY2);
      if(placekey in MAPDATA){
        var bufIMG = images[CHIPDATA[MAPDATA[placekey]].image((x - (MyVariable["chX"]/10 - chX2))*33 + 16.5 - 250, (y + (MyVariable["chY"]/10 - chY2))*33 + 16.5 - 250)];
        context.drawImage(bufIMG, (x - (MyVariable["chX"]/10 - chX2))*33, (1 + y + (MyVariable["chY"]/10 - chY2))*33 - bufIMG.height, bufIMG.width, bufIMG.height);
      }
      else{
        context.drawImage(images["black"], (x - (MyVariable["chX"]/10 - chX2))*33, (y + (MyVariable["chY"]/10 - chY2))*33, 33, 33);
      }
    }
  }

  //Character
  if(is_dead == "NO"){
    if((count % 16 < 4 && nowstate == 1) || nowstate == -1) context.drawImage(images["personU1"], 230, 227, 40, 40);
    else if(count % 16 < 8 && nowstate == 1) context.drawImage(images["personU2"], 230, 227, 40, 40);
    else if(count % 16 < 12 && nowstate == 1) context.drawImage(images["personU1"], 230, 227, 40, 40);
    else if(count % 16 < 16 && nowstate == 1) context.drawImage(images["personU3"], 230, 227, 40, 40);
    if((count % 16 < 4 && nowstate == 2) || nowstate == -2) context.drawImage(images["personD1"], 230, 227, 40, 40);
    else if(count % 16 < 8 && nowstate == 2) context.drawImage(images["personD2"], 230, 227, 40, 40);
    else if(count % 16 < 12 && nowstate == 2) context.drawImage(images["personD1"], 230, 227, 40, 40);
    else if(count % 16 < 16 && nowstate == 2) context.drawImage(images["personD3"], 230, 227, 40, 40);
    if((count % 16 < 4 && nowstate == 3) || nowstate == -3) context.drawImage(images["personL1"], 230, 227, 40, 40);
    else if(count % 16 < 8 && nowstate == 3) context.drawImage(images["personL2"], 230, 227, 40, 40);
    else if(count % 16 < 12 && nowstate == 3) context.drawImage(images["personL1"], 230, 227, 40, 40);
    else if(count % 16 < 16 && nowstate == 3) context.drawImage(images["personL3"], 230, 227, 40, 40);
    if((count % 16 < 4 && nowstate == 4) || nowstate == -4) context.drawImage(images["personR1"], 230, 227, 40, 40);
    else if(count % 16 < 8 && nowstate == 4) context.drawImage(images["personR2"], 230, 227, 40, 40);
    else if(count % 16 < 12 && nowstate == 4) context.drawImage(images["personR1"], 230, 227, 40, 40);
    else if(count % 16 < 16 && nowstate == 4) context.drawImage(images["personR3"], 230, 227, 40, 40);
  }
  else if(is_dead == "AXE"){
    context.drawImage(images["personAXE"], 230, 227, 40, 40);
  }
  else if(is_dead == "SPIDER"){
    context.drawImage(images["personSpider"], 230, 227, 40, 40);
  }
  else if(is_dead == "Roast"){
    context.drawImage(images["personBlack"], 230, 227, 40, 40);
  }

  for(let s in Spiders){
    if(Spiders[s].moveANDdraw(context) == -1){
      Spiders.splice(s,1);
    }
  }
}

var pressedKeys = {};
function onKeyDown(e) {
  switch (e.keyCode) {
    case 38://up
    pressedKeys["up"] = true;
    e.preventDefault();
    break;
    case 87://w
    pressedKeys["w"] = true;
    //e.preventDefault();
    break;
    case 40://down
    pressedKeys["down"] = true;
    e.preventDefault();
    break;
    case 83://s
    pressedKeys["s"] = true;
    //e.preventDefault();
    break;
    case 37://left
    pressedKeys["left"] = true;
    e.preventDefault();
    break;
    case 65://a
    pressedKeys["a"] = true;
    //e.preventDefault();
    break;
    case 39://right
    pressedKeys["right"] = true;
    e.preventDefault();
    break;
    case 68://d
    pressedKeys["d"] = true;
    //e.preventDefault();
    break;
    case 32:
    pressedKeys["space"] = true;
    e.preventDefault();
    break;
    default:
    break;
  }
}

function onKeyUp(e) {
  switch (e.keyCode) {
    case 38://up
    pressedKeys["up"] = false;
    e.preventDefault();
    break;
    case 87://w
    pressedKeys["w"] = false;
    //e.preventDefault();
    break;
    case 40://down
    pressedKeys["down"] = false;
    e.preventDefault();
    break;
    case 83://s
    pressedKeys["s"] = false;
    //e.preventDefault();
    break;
    case 37://left
    pressedKeys["left"] = false;
    e.preventDefault();
    break;
    case 65://a
    pressedKeys["a"] = false;
    //e.preventDefault();
    break;
    case 39://right
    pressedKeys["right"] = false;
    e.preventDefault();
    break;
    case 68://d
    pressedKeys["d"] = false;
    //e.preventDefault();
    break;
    case 32:
    pressedKeys["space"] = false;
    e.preventDefault();
    break;
    default:
    break;
  }
}



//Debug
var isDebug = false;

function onClick(e){
  if(e.clientX < 500 && e.clientY < 500 && isDebug){
    var chX2 = Math.floor(MyVariable["chX"]/10);
    var chY2 = Math.floor(MyVariable["chY"]/10);
    var newX = Math.floor(((MyVariable["chX"]/10 - chX2) * 33 + e.clientX)/33) + chX2;
    var newY = Math.floor(((-MyVariable["chY"]/10 + chY2) * 33 + e.clientY)/33) - chY2;
    document.getElementById('X').innerText = newX;
    document.getElementById('Y').innerText = newY;
    var placekey = newX + "," + newY;
    if(placekey in MAPDATA){
      document.getElementById('text_Type').value = MAPDATA[placekey];
    }
    else {
      document.getElementById('text_Type').value = "";
    }
    e.preventDefault();
  }
}

function onContextMenu(e) {
  if(e.clientX < 500 && e.clientY < 500 && isDebug){
    var chX2 = Math.floor(MyVariable["chX"]/10);
    var chY2 = Math.floor(MyVariable["chY"]/10);
    var newX = Math.floor(((MyVariable["chX"]/10 - chX2) * 33 + e.clientX)/33) + chX2;
    var newY = Math.floor(((-MyVariable["chY"]/10 + chY2) * 33 + e.clientY)/33) - chY2;
    document.getElementById('X').innerText = newX;
    document.getElementById('Y').innerText = newY;
    var placekey = newX + "," + newY;
    if(document.getElementById('text_Change2').value.length > 0){
      MAPDATA[placekey] = document.getElementById('text_Change2').value;
    }
    else{
      delete MAPDATA[placekey];
    }
    e.preventDefault();
  }
}

function copyclicked() {
  document.getElementById('text_Change2').value = document.getElementById('text_Type').value;
}

function outDataclicked(){
  var text = "var MAPDATA = {};\n";
  for (let key in MAPDATA) {
    text += "MAPDATA[\"" + key + "\"] = \"" + MAPDATA[key] + "\";\n"
  }
  document.getElementById('dummytextarea').value = text;
  document.getElementById('dummytextarea').select();
  document.execCommand("copy");
  addMessage("クリップボードに貼り付けました。");
}

function debug(a){
  if(a == "on"){
    document.getElementById('debug').style.display = "block";
    isDebug = true;
  }
  else if(a == "off"){
    document.getElementById('debug').style.display = "none";
    isDebug = false;
  }
}

function doUwannaReset(){
  addMessage("本当に進捗状況をリセットしますか?");
  addYesnoInput(reset);
}

function reset(a){
  if(!a) return;
  localStorage.removeItem('savedData');
  window.location.reload();
}

function restart(){
  window.location.reload();
}

function printPlace(){
  console.log(MyVariable["chX"], MyVariable["chY"]);
}
