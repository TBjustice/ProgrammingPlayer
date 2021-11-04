//alt-cmd-shift-[

var CHIPDATA = {};

var MyVariable = {};
var Spiders = [];

var Traps = ["stoneFloorBlood"];

MyVariable["chX"] = 0;
MyVariable["chY"] = 0;

MyVariable["storyStart"] = 0;
CHIPDATA["storyStart"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "grassFloor1";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(MyVariable["storyStart"] == 0){
      MyVariable["storyStart"] = 1;
      addMessage("脱出ホラーゲーム「蟲」をプレイしていただきありがとうございます。\nメッセージをクリックすることで次に移ります。");
      addMessage("それでは、本編をどうぞ!!");
      addMessage("「動画配信サービス」と聞いてどんな印象を受けるだろうか？");
      addMessage("「見ていて面白い」「お小遣い稼ぎが出来る」といった肯定的な印象を受けるかもしれないし、「危ない事をしがち」といった否定的な印象を受けるかもしれない。");
      addMessage("俺は中学生の時から動画配信を始め、2年が経った今は高校生動画配信者だ。");
      addMessage("人気なのかって？ははは……(乾いた笑い)聞かないでくれ。");
      addMessage("そんなわけで、視聴者さんをアッと驚かせるような動画を取りたいと思ったんだ。そこで注目したのが「心霊スポット」だ。");
      addMessage("様々な心霊スポットを巡って、動画を撮影するのだ。");
      addMessage("オカルトが好きな人たちが見てくれるだろうと思って始めた「心霊スポット巡り」だが、視聴者数が徐々に増えている。");
      addMessage("これは良い傾向だ。いつかは視聴者数10万人を突破してやりたいな!!");
      addMessage("そんなわけで、今日も今日とてやってきました、心霊スポット。ここは人が居なくなる洞窟として知られる、〇×市にある洞窟だ。");
      addMessage("早速、洞窟の入り口に向かってみよう。\nパソコンの↑キーを長押しして、洞窟の入り口に来たらスペースキーを押して下さい。");
    }
  }
};


MyVariable["startknife"] = 0;
CHIPDATA["knifeATstart"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(MyVariable["startknife"] > 0)return "grassFloor1";
    return "knifeinGrassFloor";
  },
  searched:function(){
    if(!MyVariable["startknife"]){
      addMessage("地面に何かが落ちている。");
      addMessage("ナイフを入手した。");
      MyVariable["startknife"] = true;
      return true;
    }
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["roseATstart"]={
  canGoThrough:function(){
    return MyVariable["startknife"] == 2;
  },
  image:function(x, y){
    if(MyVariable["startknife"] == 2)return "grassFloor1";
    return "roseWall";
  },
  searched:function(){
    if(MyVariable["startknife"] == 1){
      addMessage("ナイフで茨を切った。");
      addMessage("ナイフは壊れてしまった。");
      MyVariable["startknife"] = 2;
      return true;
    }
    else if(MyVariable["startknife"] == 0){
      addMessage("茨が道をふさいでいる。");
      addMessage("どこかに茨を切ることが出来る道具が落ちていないだろうか？");
      addMessage("周辺を探してみよう。なお、気になる物を詳しく調べたり、物を拾ったりしたいときはスペースキーを押して下さい。ただし、当たり判定が結構曖昧です。ご容赦ください。");
      addMessage("道具を発見したら、もう一度この茨の前に来てスペースキーを押して下さい。");
      return true;
    }
    return false;
  },
  stepped:function(){

  }
};


CHIPDATA["woodDoor1"] = {
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "woodDoor";
  },
  searched:function(){
    addMessage("石畳だけでなく、ドアまであるのか。これは絶対、人工の洞窟だよなあ……");
    addMessage("そんなことを思いながら、ドアを開けて中に入った。");
    addMovement(0, 50);
    addMessage("「ガチャリ」");
    addMessage("「えっ？」ガチャ!ガチャ!!ガチャ!!!");
    addMessage("鍵がかかってしまった。なにやらパスワード(英文字)を入力しないと開けられないようだ。");
    addMessage("「嘘だろ？おい。」");
    addMessage("蹴っても殴っても扉はびくともしない。しかも、電波が届いていないようでスマートフォンも使えない。");
    addMessage("「くそ、こんなことをしていても埒が明かねえな。取り敢えず、周囲を調べてみるか。」");
    addMessage("※重要なメッセージです\nこの先、即死要素があります。注意して行動して下さい。トラップを踏んでしまって死ぬかもしれませんし、突然敵が襲ってくるかもしれません。");
    addMessage("なお、スペースキーを押して「調べ」ただけで死ぬようなトラップは無いです。気になる物は徹底的に調べる事をお勧めします。");
    addMessage("※重要なメッセージです\nこの先、グロテスクな描写があります。苦手な方は見ないようにお願いします。");
    return true;
  },
  stepped:function(){

  }
}

MyVariable["isPassWord1Opened"] = false;
CHIPDATA["passWord1"] = {
  canGoThrough:function(){
    return MyVariable["isPassWord1Opened"];
  },
  image:function(x, y){
    if( MyVariable["isPassWord1Opened"]) return "stoneFloor";
    return "stoneFloorPass";
  },
  searched:function(){
    if(!MyVariable["isPassWord1Opened"]){
      addMessage("鍵がかかっているようだ。パスコードを入力しないといけないのか？");
      addImgMessage("passwordInput1");
      addInputText(CHIPDATA["passWord1"].passCheck);
      return true;
    }
    else {
      return false;
    }
  },
  passCheck:function(text){
    if(text == "463"){
      MyVariable["isPassWord1Opened"] = true;
      addMessage("鍵が空いた。");
    }
    else{
      addMessage("パスコードが違うようだ。");
    }
  },
  stepped:function(){

  }
}

MyVariable["isPassWord2Opened"] = false;
CHIPDATA["passWord2"] = {
  canGoThrough:function(){
    return MyVariable["isPassWord2Opened"];
  },
  image:function(x, y){
    if( MyVariable["isPassWord2Opened"]) return "stoneFloor";
    return "stoneFloorPass2";
  },
  searched:function(){
    if(!MyVariable["isPassWord2Opened"]){
      addMessage("鍵がかかっているようだ。パスコードを入力しないといけないのか？");
      addImgMessage("passwordInput2");
      addInputText(CHIPDATA["passWord2"].passCheck);
      return true;
    }
    else {
      return false;
    }
  },
  passCheck:function(text){
    if(text == "7482"){
      MyVariable["isPassWord2Opened"] = true;
      addMessage("鍵が空いた。");
    }
    else{
      addMessage("パスコードが違うようだ。");
    }
  },
  stepped:function(){

  }
}


MyVariable["isPassWord3Opened"] = false;
CHIPDATA["passWord3"] = {
  canGoThrough:function(){
    return MyVariable["isPassWord3Opened"];
  },
  image:function(x, y){
    if( MyVariable["isPassWord3Opened"]) return "stoneFloor";
    return "stoneFloorPass2";
  },
  searched:function(){
    if(!MyVariable["isPassWord3Opened"]){
        addMessage("鍵がかかっている。パスコードを入力しないといけないようだ。今までと違って英文字を入力できるみたいだな。見た感じだと、小文字は入力できないらしい。");
      addInputText(CHIPDATA["passWord3"].passCheck);
      return true;
    }
    else {
      return false;
    }
  },
  passCheck:function(text){
    if(text == "ETRETRRETEERTERT"){
      MyVariable["isPassWord3Opened"] = true;
      addMessage("鍵が空いた。");
    }
    else{
      addMessage("パスコードが違うようだ。");
    }
  },
  stepped:function(){

  }
}

MyVariable["isPassWord4Opened"] = false;
CHIPDATA["passWord4"] = {
  canGoThrough:function(){
    return MyVariable["isPassWord4Opened"];
  },
  image:function(x, y){
    if( MyVariable["isPassWord4Opened"]) return "stoneFloor";
    return "stoneFloorPass";
  },
  searched:function(){
    if(!MyVariable["isPassWord4Opened"]){
      addMessage("鍵がかかっているようだ。パスコードを入力しないといけないのか？");
      addImgMessage("passwordInput4");
      addInputText(CHIPDATA["passWord4"].passCheck);
      return true;
    }
    else {
      return false;
    }
  },
  passCheck:function(text){
    if(text == "3125"){
      MyVariable["isPassWord4Opened"] = true;
      addMessage("鍵が空いた。");
    }
    else{
      addMessage("パスコードが違うようだ。");
    }
  },
  stepped:function(){

  }
}

MyVariable["isElectrical"]=false;
MyVariable["isElectricalGold"]=false;
CHIPDATA["electricalSwitch"] = {
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    if(!MyVariable["isElectrical"]) return "stoneWallSwitchOff";
    return "stoneWallSwitchOn";
  },
  searched:function(){
    if(!MyVariable["isElectrical"]){
      addMessage("レバーを下した。");
      addMessage("ウイーーン。");
      addMessage("電源が通ったようだ。");
      MyVariable["isElectrical"] = true;
    }
    else {
      addMessage("レバーを上げた。");
      addMessage("ウイーーン.......");
      addMessage("電源が止まったようだ。");
      MyVariable["isElectrical"] = false;
    }

    if(!MyVariable["isElectricalGold"]){
      MyVariable["isElectricalGold"] = true;
      addMessage("あれ、金貨が落ちてきた。拾っておこう。");
      addMessage("金貨を二枚入手しました。");
      MyVariable["Gold"]+=2;
      document.getElementById("gold").innerText = "所持している金貨の枚数:" + MyVariable["Gold"];
    }
    return true;
  },
  stepped:function(){

  }
}

//*****
function isPuzzleOver(){
  return MyVariable["puzzleN"]==0&&MyVariable["puzzleS"]==0&&MyVariable["puzzleE"]==0&&MyVariable["puzzleW"]==0&&MyVariable["puzzleSE"]==0&&MyVariable["puzzleSW"]==0&&MyVariable["puzzleNE"]==0&&MyVariable["puzzleNW"]==0&&MyVariable["puzzleC"]==0;
}
CHIPDATA["btnOfPuzzleNE"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"])return "stoneFloorWithButton2";
    return "stoneFloorWithButton";
  },
  searched:function(){
    if(isPuzzleOver()) {
      addMessage("もう押す必要はない。");
    }
    else if(MyVariable["isElectrical"]){
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("周囲の時計が動いた。");
      MyVariable["puzzleNE"]++;
      MyVariable["puzzleN"]++;
      MyVariable["puzzleE"]++;
      MyVariable["puzzleC"]++;
      MyVariable["puzzleNE"]%=4;
      MyVariable["puzzleN"]%=4;
      MyVariable["puzzleE"]%=4;
      MyVariable["puzzleC"]%=4;
      if(isPuzzleOver()) {
        addMessage("どこかの扉が開く音がした。");
      }
    }
    else{
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("何も起こらなかった。電気が通っていないのだろうか？");
    }
    return true;
  },
  stepped:function(){
  }
};
CHIPDATA["btnOfPuzzleNW"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"])return "stoneFloorWithButton2";
    return "stoneFloorWithButton";
  },
  searched:function(){
    if(isPuzzleOver()) {
      addMessage("もう押す必要はない。");
    }
    else if(MyVariable["isElectrical"]){
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("周囲の時計が動いた。");
      MyVariable["puzzleNW"]++;
      MyVariable["puzzleN"]++;
      MyVariable["puzzleW"]++;
      MyVariable["puzzleC"]++;
      MyVariable["puzzleNW"]%=4;
      MyVariable["puzzleN"]%=4;
      MyVariable["puzzleW"]%=4;
      MyVariable["puzzleC"]%=4;
      if(isPuzzleOver()) {
        addMessage("どこかの扉が開く音がした。");
      }
    }
    else{
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("何も起こらなかった。電気が通っていないのだろうか？");
    }
    return true;
  },
  stepped:function(){
  }
};
CHIPDATA["btnOfPuzzleSE"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"])return "stoneFloorWithButton2";
    return "stoneFloorWithButton";
  },
  searched:function(){
    if(isPuzzleOver()) {
      addMessage("もう押す必要はない。");
    }
    else if(MyVariable["isElectrical"]){
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("周囲の時計が動いた。");
      MyVariable["puzzleSE"]++;
      MyVariable["puzzleS"]++;
      MyVariable["puzzleE"]++;
      MyVariable["puzzleC"]++;
      MyVariable["puzzleSE"]%=4;
      MyVariable["puzzleS"]%=4;
      MyVariable["puzzleE"]%=4;
      MyVariable["puzzleC"]%=4;
      if(isPuzzleOver()) {
        addMessage("どこかの扉が開く音がした。");
      }
    }
    else{
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("何も起こらなかった。電気が通っていないのだろうか？");
    }
    return true;
  },
  stepped:function(){
  }
};
CHIPDATA["btnOfPuzzleSW"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"])return "stoneFloorWithButton2";
    return "stoneFloorWithButton";
  },
  searched:function(){
    if(isPuzzleOver()) {
      addMessage("もう押す必要はない。");
    }
    else if(MyVariable["isElectrical"]){
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("周囲の時計が動いた。");
      MyVariable["puzzleSW"]++;
      MyVariable["puzzleS"]++;
      MyVariable["puzzleW"]++;
      MyVariable["puzzleC"]++;
      MyVariable["puzzleSW"]%=4;
      MyVariable["puzzleS"]%=4;
      MyVariable["puzzleW"]%=4;
      MyVariable["puzzleC"]%=4;
      if(isPuzzleOver()) {
        addMessage("どこかの扉が開く音がした。");
      }
    }
    else{
      addMessage("ボタンを押した。");
      addMessage("……");
      addMessage("何も起こらなかった。電気が通っていないのだろうか？");
    }
    return true;
  },
  stepped:function(){
  }
};
//*****

MyVariable["puzzleN"] = 1;
CHIPDATA["puzzleN"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleN"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleS"] = 1;
CHIPDATA["puzzleS"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleS"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleE"] = 1;
CHIPDATA["puzzleE"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleE"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleW"] = 1;
CHIPDATA["puzzleW"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleW"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleNE"] = 2;
CHIPDATA["puzzleNE"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleNE"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleSW"] = 2;
CHIPDATA["puzzleSW"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleSW"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleSE"] = 3;
CHIPDATA["puzzleSE"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleSE"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleNW"] = 3;
CHIPDATA["puzzleNW"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleNW"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};

MyVariable["puzzleC"] = 2;
CHIPDATA["puzzleC"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    switch (MyVariable["puzzleC"]) {
      case 0:
      return "puzzleUP";
      break;
      case 1:
      return "puzzleRIGHT";
      break;
      case 2:
      return "puzzleDOWN";
      break;
      case 3:
      return "puzzleLEFT";
      break;
    }
  },
  searched:function(){
    addMessage("地面に時計のようなものが埋め込まれている。");
    return true;
  },
  stepped:function(){
  }
};


CHIPDATA["EastDoor"] = {
  canGoThrough:function(){
    return isPuzzleOver();
  },
  image:function(x, y){
    if(isPuzzleOver()) return "stoneFloor";
    return "stoneFloorPass";
  },
  searched:function(){
    if(!isPuzzleOver()){
      addMessage("鍵がかかっているようだ。");
      return true;
    }
    else {
      return false;
    }
  },
  stepped:function(){
  }
}


CHIPDATA["stoneFloorBlood"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloorBlood";
  },
  searched:function(){
    addMessage("床に血がついている……。何故だろう？");
    return true;
  },
  stepped:function(){
    if(is_dead == "NO"){
      is_dead = "AXE";
      addMessage("罠にかかって死んでしまった……");
    }
  }
};


MyVariable["spiderReleased1"] = false;
CHIPDATA["spiderReleased1"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(!MyVariable["spiderReleased1"]){
      addMessage("ガサガサ!!");
      addMessage("「うん、何だ?ってうわあ!!」");
      addMessage("大きな蜘蛛が現れた!!急いで逃げないと!!");
      addMessage("※重要なメッセージです。\n蜘蛛は罠の位置(血だまりが出来ている場所)を察知できません。蜘蛛を罠まで誘導する事で、蜘蛛を倒すことが出来ます。さあ、Run for Life!!");
      MyVariable["spiderReleased1"] = true;
      Spiders.push(new _Spider(130, 552));
    }
  }
};

MyVariable["spiderReleased2"] = false;
CHIPDATA["spiderReleased2"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(!MyVariable["spiderReleased2"]){
      MyVariable["spiderReleased2"] = true;
      addMessage("蜘蛛だ!!逃げろ!!");
      Spiders.push(new _Spider(28, 680));
    }
  }
};

MyVariable["spiderReleased3"] = false;
CHIPDATA["spiderReleased3"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(!MyVariable["spiderReleased3"]){
      MyVariable["spiderReleased3"] = true;
      addMessage("蜘蛛だ!!逃げろ!!");
      Spiders.push(new _Spider(150, 790));
      Spiders.push(new _Spider(90, 780));
    }
  }
};

MyVariable["spiderReleased4"] = false;
CHIPDATA["spiderReleased4"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(!MyVariable["spiderReleased4"]){
      MyVariable["spiderReleased4"] = true;
      addMessage("蜘蛛だ!!逃げろ!!");
      Spiders.push(new _Spider(270, 500));
    }
  }
};

MyVariable["spiderReleased5"] = false;
CHIPDATA["spiderReleased5"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){
    if(!MyVariable["spiderReleased5"]){
      MyVariable["spiderReleased5"] = true;
      addMessage("蜘蛛だ!!逃げろ!!");
      addMessage("※重要なメッセージです。\nこのゲームにおいて、カマキリは蜘蛛を食べないのでご注意を!!");
      Spiders.push(new _Spider(368, 558));
      Spiders.push(new _Spider(378, 558));
      Spiders.push(new _Spider(388, 558));
      Spiders.push(new _Spider(398, 558));
      Spiders.push(new _Spider(408, 558));
    }
  }
};

//Messagle floor

CHIPDATA["ENNisEllipse"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "PaperStoneFloor";
  },
  searched:function(){
    addMessage("「〇は英語でEllipseと言う」と書かれている。");
    addMessage("ちなみに、Circleは円でEllipseは楕円全般を指すぞ。");
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["SANNKAKUisTriangle"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "PaperStoneFloor";
  },
  searched:function(){
    addMessage("地面に紙切れが落ちている。");
    addMessage("「△は英語でTriangleと言う。」と書かれている。");
    addMessage("まあ、そうだよな。");
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["SHIKAKUisRectangle"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "PaperStoneFloor";
  },
  searched:function(){
    addMessage("地面に紙切れが落ちている。");
    addMessage("「□は英語でRectangleと言う。」と書かれている。");
    addMessage("まあ、そうだよな。ちなみに、Squareは正方形でRectangleは長方形全般を指すぞ。");
    return true;
  },
  stepped:function(){

  }
};

//Save

MyVariable["Gold"] = 0;
CHIPDATA["saveFountain"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "fountain";
  },
  searched:function(){
    addMessage("噴水がある。水の中には金貨が沈められているようだ。何か願いが叶うとかだろうか？");
    addMessage("噴水に彫られている説明書きにはこんな風に書いてある。");
    addMessage("『金貨を捧げよ。さすれば魂を保存してやる。』");
    addMessage("どういう意味だろう？");
    addMessage("※重要なメッセージです\nここに来て金貨を捧げるとセーブ出来ます。金貨を使用してセーブしますか？");
    addYesnoInput(CHIPDATA["saveFountain"].save);
    return true;
  },
  save:function(a){
    if(a){
      if(MyVariable["Gold"] > 0){
        MyVariable["Gold"]-=1;
        document.getElementById("gold").innerText = "所持している金貨の枚数:" + MyVariable["Gold"];
        localStorage.setItem('savedData', JSON.stringify(MyVariable));
        addMessage("セーブしました。");
      }
      else {
        addMessage("金貨が足りません");
      }
    }
    else{
      addMessage("またのご利用お待ちしています。")
    }
  },
  stepped:function(){

  }
};

//New Trap

CHIPDATA["stoneFloorTrap1"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"] && count < 40){
      return "stoneFloorBurning";
    }
    return "stoneFloorDot";
  },
  searched:function(){
    if(MyVariable["isElectrical"]){
      addMessage("周期的に炎が出ている!!間違って自分に引火したら大変だ。気を付けて歩こう。");
    }
    else{
      addMessage("地面には怪しい穴が空いているが、特に危険は無さそうだ。");
    }
    return true;
  },
  stepped:function(){
    if(MyVariable["isElectrical"] && count < 40){
      if(is_dead=="NO"){
        addMessage("真っ黒こげになってしまった。");
        is_dead = "Roast";
      }
    }
  }
};
CHIPDATA["stoneFloorTrap2"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"] && count >= 40 && count < 80){
      return "stoneFloorBurning";
    }
    return "stoneFloorDot";
  },
  searched:function(){
    if(MyVariable["isElectrical"]){
      addMessage("周期的に炎が出ている!!間違って自分に引火したら大変だ。気を付けて歩こう。");
    }
    else{
      addMessage("地面には怪しい穴が空いているが、特に危険は無さそうだ。");
    }
    return true;
  },
  stepped:function(){
    if(MyVariable["isElectrical"] && count >= 40 && count < 80){
      if(is_dead=="NO"){
        addMessage("真っ黒こげになってしまった。");
        is_dead = "Roast";
      }
    }
  }
};
CHIPDATA["stoneFloorTrap3"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(MyVariable["isElectrical"] && count >= 80 && count < 120){
      return "stoneFloorBurning";
    }
    return "stoneFloorDot";
  },
  searched:function(){
    if(MyVariable["isElectrical"]){
      addMessage("周期的に炎が出ている!!間違って自分に引火したら大変だ。気を付けて歩こう。");
    }
    else{
      addMessage("地面には怪しい穴が空いているが、特に危険は無さそうだ。");
    }
    return true;
  },
  stepped:function(){
    if(MyVariable["isElectrical"] && count >= 80 && count < 120){
      if(is_dead=="NO"){
        addMessage("真っ黒こげになってしまった。");
        is_dead = "Roast";
      }
    }
  }
};

CHIPDATA["kamakiritrap"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(-50<=x && x<=50 && -50<=y && y<=50){
      return "kamakiritrap";
    }
    return "stoneFloor";
  },
  searched:function(){
    addMessage("横の穴からカマキリが顔を出してきた!!近づきすぎたら食べられてしまいそうだ。気を付けよう。");
    return true;
  },
  stepped:function(){
    if(is_dead=="NO"){
      addMessage("壁から飛び出てきたカマキリに食べられてしまった。");
      is_dead = "SPIDER";
    }
  }
};

CHIPDATA["kamakiritrap2"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    if(-50<=x && x<=50 && -50<=y && y<=50){
      return "kamakiritrap2";
    }
    return "stoneFloor";
  },
  searched:function(){
    addMessage("横の穴からカマキリが顔を出してきた!!近づきすぎたら食べられてしまいそうだ。気を付けよう。");
    return true;
  },
  stepped:function(){
    if(is_dead=="NO"){
      addMessage("壁から飛び出てきたカマキリに食べられてしまった。");
      is_dead = "SPIDER";
    }
  }
};

//Final
CHIPDATA["lasthint"] = {
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "stoneWallPaper";
  },
  searched:function(){
    addMessage("壁に何か貼ってある。なんだろう？");
    addImgMessage("lasthint");
    return true;
  },
  stepped:function(){

  }
};

MyVariable["isPassWord5Opened"] = false;
CHIPDATA["passWord5"] = {
  canGoThrough:function(){
    return MyVariable["isPassWord5Opened"];
  },
  image:function(x, y){
    if(MyVariable["isPassWord5Opened"]) return "stoneFloor";
    return "stoneFloorPass2";
  },
  searched:function(){
    if(!MyVariable["isPassWord5Opened"]){
      addMessage("鍵がかかっている。脱出するにはパスコードを入力しないといけないようだ。");
      addInputText(CHIPDATA["passWord5"].passCheck);
      return true;
    }
    else {
      return false;
    }
  },
  passCheck:function(text){
    if(text == "OXN"){
      MyVariable["isPassWord5Opened"] = true;
      addMessage("鍵が空いた。");
      addMessage("無事扉が開き、俺は脱出に成功した。");
      addMessage("無我夢中で人里まで走り、電車に飛び乗って帰路についた。");
      addMessage("後程、インターネットで詳しく調べると、あの一帯では蟲を崇める宗教があるらしい。");
      addMessage("その宗教とあの洞窟に何らかの関係があるのかは不明だった。");
      addMessage("これを機に、俺は動画配信を辞め、代わりにプログラミングの勉強を始めた。そして、今日の体験をゲームにしようと思ったのだ。");
      addMessage("動画編集と比べるとゲーム製作は遥かに困難だったが、何とか形にすることが出来た。今この文章を誰か読んでいるという事は、俺の作ったゲームが遊ばれているという事だろう。");
      addMessage("Fin.");
      gameclear = true;
    }
    else{
      addMessage("パスコードが違うようだ。");
    }
  },
  stepped:function(){
  }
}

//NO ACTION
CHIPDATA["stoneFloor"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["stoneFloor_Square"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor_Square";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["stoneFloor_Triangle"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "stoneFloor_Triangle";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["StoneFloor_Circle"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "StoneFloor_Circle";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["woodFloor"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "woodFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["stoneWallATstart"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "stoneWallATstart";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["stoneWall"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "stoneWall";
  },
  searched:function(){

  },
  stepped:function(){

  }
};

CHIPDATA["woodFloor"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "woodFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["sandFloor"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "sandFloor";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["grassFloor1"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "grassFloor1";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["grassFloor2"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "grassFloor2";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["grassFloor3"]={
  canGoThrough:function(){
    return true;
  },
  image:function(x, y){
    return "grassFloor3";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};

CHIPDATA["flowerR"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "flowerR";
  },
  searched:function(){
    addMessage("オレンジ色の造花だ。");
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["flowerB"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "flowerB";
  },
  searched:function(){
    addMessage("青色の造花だ。");
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["flowerY"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "flowerY";
  },
  searched:function(){
    addMessage("黄色の造花だ。");
    return true;
  },
  stepped:function(){

  }
};

MyVariable["goldinstatueNE"] = false;
CHIPDATA["statueNE"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "statueNE";
  },
  searched:function(){
    addMessage("蝶の標本だ。");
    addMessage("台座に何か書いてある。");
    addMessage("【蜘蛛とクワガタムシは素数】");
    addMessage("どういう意味だろう？");
    if(!MyVariable["goldinstatueNE"]){
      MyVariable["goldinstatueNE"] = true;
      addMessage("あれ、標本の横に、金貨が落ちているぞ。拾っておこう。");
      addMessage("金貨を二枚入手しました。");
      MyVariable["Gold"]+=2;
      document.getElementById("gold").innerText = "所持している金貨の枚数:" + MyVariable["Gold"];
    }
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["statueNW"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "statueNW";
  },
  searched:function(){
    addMessage("蜘蛛の標本だ。");
    addMessage("台座に何か書いてある。");
    addMessage("【カブトムシ－クワガタムシ＝(蝶－蜘蛛)÷蜘蛛】");
    addMessage("どういう意味だろう？");
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["statueSE"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "statueSE";
  },
  searched:function(){
    addMessage("カブトムシの標本だ。");
    addMessage("台座に何か書いてある。");
    addMessage("【４匹の蟲は一桁の自然数】");
    addMessage("どういう意味だろう？");
    return true;
  },
  stepped:function(){

  }
};

MyVariable["goldinstatueSW"] = false;
CHIPDATA["statueSW"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "statueSW";
  },
  searched:function(){
    addMessage("クワガタムシの標本だ。");
    addMessage("台座に何か書いてある。");
    addMessage("【蜘蛛×蝶＝カブトムシ】");
    addMessage("どういう意味だろう？");
    if(!MyVariable["goldinstatueSW"]){
      MyVariable["goldinstatueSW"] = true;
      addMessage("あれ、標本の横に、金貨が落ちているぞ。拾っておこう。");
      addMessage("金貨を二枚入手しました。");
      MyVariable["Gold"]+=2;
      document.getElementById("gold").innerText = "所持している金貨の枚数:" + MyVariable["Gold"];
    }
    return true;
  },
  stepped:function(){

  }
};

CHIPDATA["black"]={
  canGoThrough:function(){
    return false;
  },
  image:function(x, y){
    return "black";
  },
  searched:function(){
    return false;
  },
  stepped:function(){

  }
};
