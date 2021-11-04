var interactQue = [];

function onInteract(){
  if(interactQue.length > 0){
    var buf = interactQue[0]
    if(buf[0] == "msg"){
      div_textMessage.style.display = "block";
      h2_message.innerText = buf[1];
    }
    else if (buf[0] == "move") {
      MyVariable["chX"] += buf[1];
      MyVariable["chY"] += buf[2];
      interactQue.shift();
    }
    else if(buf[0] == "textInput"){
      div_textInput.style.display = "block";
    }
    else if(buf[0] == "yesnoInput"){
      div_yesnoInput.style.display = "block";
    }
    else if(buf[0] == "img"){
      div_imgMessage.style.display = "block";
      document.getElementById('img_imgMessage').src = "image/" + buf[1] + ".png";
    }
  }
  else{
    return false;
  }
  return true;
}

function addMessage(text){
  interactQue.push(["msg", text]);
}

function addMovement(dx, dy){
  interactQue.push(["move", dx, dy]);
}

function addInputText(func){
  interactQue.push(["textInput", func]);
}

function addImgMessage(text){
  interactQue.push(["img", text]);
}

function addYesnoInput(func){
  interactQue.push(["yesnoInput", func]);
}


//End of Input

function TextMessage(){
  div_textMessage.style.display = "none";
  interactQue.shift();
}

function ImgMessage() {
  div_imgMessage.style.display = "none";
  interactQue.shift();
}

function textInputOk(){
  interactQue[0][1](document.getElementById("text_TextInput").value);
  document.getElementById("text_TextInput").value = "";
  div_textInput.style.display = "none";
  interactQue.shift();
}

function yesno(a){
  interactQue[0][1](a);
  div_yesnoInput.style.display = "none";
  interactQue.shift();
}
