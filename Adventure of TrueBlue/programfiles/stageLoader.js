function loadFile(){
  return new Promise((resolve, reject) => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "./stage.st", true);
    rawFile.onreadystatechange = function (){
      if(rawFile.readyState === 4){
        if(rawFile.status === 200){
          resolve(rawFile.responseText);
        }else{
          reject("./stage.stが存在しません。");
        }
      }
    }
    rawFile.send(null);
  });
}

var stageData=[];
async function decodeStageFile(){
  stagerawtext = await loadFile().catch(e => {
    console.log('onload error', e);
  });
  let lines=stagerawtext.split("\n");
  for(var i=0; i<lines.length; i++){
    let line = lines[i].trim().replaceAll(" ", "");
    linedata = line.split(",");
    linedataint = [];
    for (d of linedata){
      linedataint.push(parseInt(d));
    }
    stageData.push(linedataint);
  }
}
