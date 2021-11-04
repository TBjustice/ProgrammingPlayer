var _distanceData = {};

var _lastchX2 = 0, _lastchY2 = 0;
function makeDistanceData(){
    //************************************************************************
    var chX2 = Math.floor(MyVariable["chX"]/10 + 0.5);
    var chY2 = Math.floor(MyVariable["chY"]/10);
    if(_lastchX2 == chX2 && _lastchY2 == chY2) return;
    _lastchX2 = chX2;
    _lastchY2 = chY2;
    _distanceData = {};
    var _que = [];
    _que.push([0, chX2, chY2]);
    while (true) {
      if(_que.length == 0 || _que[0][0] > 10) break;
      var _dist = _que[0][0];
      var _x = _que[0][1];
      var _y = _que[0][2];
      _distanceData[(7+_x) + "," + (7-_y)] = _dist;
      var placekey = (8+_x) + "," + (7-_y);
      if(!(placekey in _distanceData) && placekey in MAPDATA && CHIPDATA[MAPDATA[placekey]].canGoThrough()){
        _que.push([_dist+1, 1+_x, _y]);
      }
      placekey = (6+_x) + "," + (7-_y);
      if(!(placekey in _distanceData) && placekey in MAPDATA && CHIPDATA[MAPDATA[placekey]].canGoThrough()){
        _que.push([_dist+1, -1+_x, _y]);
      }
      placekey = (7+_x) + "," + (6-_y);
      if(!(placekey in _distanceData) && placekey in MAPDATA && CHIPDATA[MAPDATA[placekey]].canGoThrough()){
        _que.push([_dist+1, _x, 1+_y]);
      }
      placekey = (7+_x) + "," + (8-_y);
      if(!(placekey in _distanceData) && placekey in MAPDATA && CHIPDATA[MAPDATA[placekey]].canGoThrough()){
        _que.push([_dist+1, _x, -1+_y]);
      }
      _que.shift();
    }
    //************************************************************************
}

function _Spider(x, y){
  this.x = x;
  this.y = y;
  this.moveANDdraw = function(context){
    var buf = 1.5;
    if(interactQue.length > 0)buf = 0;

    var chX = this.x - MyVariable["chX"];
    var chY = this.y - MyVariable["chY"];
    if(Math.abs(chX) <= 160 && Math.abs(chY) <= 160){
      makeDistanceData();

      var chX2 = Math.floor(this.x/10 + 0.5);
      var chY2 = Math.floor(this.y/10);
      var placekey = (7+chX2) + "," + (7-chY2);
      if(placekey in MAPDATA){
        if(Traps.indexOf(MAPDATA[placekey]) >= 0){
          addMessage("蜘蛛は罠にかかって死んだ。");
          return -1;
        }
      }
      if(placekey in _distanceData){
        var now = _distanceData[placekey];
        if(now==0){
          if(is_dead=="NO"){
            is_dead="SPIDER";
            addMessage("巨大な蜘蛛に食べられてしまった。");
          }
          context.drawImage(images["spiderD"], 225, 235, 50, 50);
          return 1;
        }
        //**********************************************************************
        chX2 = Math.floor(this.x/10 + 0.9);
        chY2 = Math.floor(this.y/10);
        var placekey = (7+chX2) + "," + (7-chY2);
        if (!(placekey in _distanceData) || _distanceData[placekey] > now) {
          this.x-=buf;
          context.drawImage(images["spiderL"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 + 0.1);
        chY2 = Math.floor(this.y/10);
        placekey = (7+chX2) + "," + (7-chY2);
        if (!(placekey in _distanceData) || _distanceData[placekey] > now) {
          this.x+=buf;
          context.drawImage(images["spiderR"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 + 0.5);
        chY2 = Math.floor(this.y/10 + 0.4);
        placekey = (7+chX2) + "," + (7-chY2);
        if (!(placekey in _distanceData) || _distanceData[placekey] > now) {
          this.y-=buf;
          context.drawImage(images["spiderD"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 + 0.5);
        chY2 = Math.floor(this.y/10 - 0.4);
        placekey = (7+chX2) + "," + (7-chY2);
        if (!(placekey in _distanceData) || _distanceData[placekey] > now) {
          this.y+=buf;
          context.drawImage(images["spiderU"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        //**********************************************************************
        chX2 = Math.floor(this.x/10 + 1.49);
        chY2 = Math.floor(this.y/10);
        placekey = (7+chX2) + "," + (7-chY2);
        if(placekey in _distanceData && _distanceData[placekey] < now){
          this.x+=buf;
          context.drawImage(images["spiderR"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 - 0.49);
        chY2 = Math.floor(this.y/10);
        placekey = (7+chX2) + "," + (7-chY2);
        if(placekey in _distanceData && _distanceData[placekey] < now){
          this.x-=buf;
          context.drawImage(images["spiderL"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 + 0.5);
        chY2 = Math.floor(this.y/10 + 0.99);
        placekey = (7+chX2) + "," + (7-chY2);
        if(placekey in _distanceData && _distanceData[placekey] < now){
          this.y+=buf;
          context.drawImage(images["spiderU"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        chX2 = Math.floor(this.x/10 + 0.5);
        chY2 = Math.floor(this.y/10 - 0.99);
        placekey = (7+chX2) + "," + (7-chY2);
        if(placekey in _distanceData && _distanceData[placekey] < now){
          this.y-=buf;
          context.drawImage(images["spiderD"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);
          return 1;
        }
        //**********************************************************************
      }

      context.drawImage(images["spiderD"], chX*3.3 + 225, -chY*3.3 + 230, 50, 50);

      //************************************************************************
      return 1;
    }
    return 0;
  }
}




//context.drawImage(images["spiderU"], chX2*3.3 + 250, -chY2*3.3 + 250, 40, 40);
