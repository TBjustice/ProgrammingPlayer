var canvas;
var canvassize = [0, 0];
var frame0;
var frame1;
var program = new GLSLProgram();
var time=0;
let CrystalsPlace=[];
let CrystalsRotation=[];
let Crystals = [];
let Star1;
let Star1Rotation=0;
let Star2;
let Star2Rotation=0;
const NUMCRYSTAL = 200;

function AddCone(position, index, y1, y2, r){
  let offset_I = position.length;
  for(let i=0; i<180; i++){
    position.push(new Vec3f(r*Math.cos(i*2*Math.PI/180), y1, r*Math.sin(i*2*Math.PI/180)));
    index.push(new Vec3i(offset_I+180, offset_I+(i+1)%180, offset_I+i));
  }
  position.push(new Vec3f(0, y2, 0));
  for (let i=0; i<179; i++){
    index.push(new Vec3i(offset_I+0, offset_I+i+1, offset_I+(i+2)%180));
  }
}

function AddTube(position, index, y1, y2, r){
  let offset_I = position.length;
  for(let i=0; i<180; i++){
    position.push(new Vec3f(r*Math.cos(i*2*Math.PI/180), y2, r*Math.sin(i*2*Math.PI/180)));
  }
  for(let i=0; i<180; i++){
    position.push(new Vec3f(r*Math.cos(i*2*Math.PI/180), y1, r*Math.sin(i*2*Math.PI/180)));
  }
  for(let i=0; i<180; i++){
    index.push(new Vec3i(offset_I+i+0, offset_I+(i+1)%180, offset_I+i+180));
    index.push(new Vec3i(offset_I+(i+1)%180+180, offset_I+i+180, offset_I+(i+1)%180));
  }
}

function MakeCrystal(position, index, s){
  let offset_I = position.length;
  position.push(new Vec3f( 0.10*s, 0.00*s, 0.00*s));
  position.push(new Vec3f( 0.01*s, 0.01*s, 0.00*s));
  position.push(new Vec3f( 0.01*s,-0.01*s, 0.00*s));
  index.push(new Vec3i(offset_I+0, offset_I+1, offset_I+2));
  index.push(new Vec3i(offset_I+0, offset_I+2, offset_I+1));

  position.push(new Vec3f(-0.10*s, 0.00*s, 0.00*s));
  position.push(new Vec3f(-0.01*s, 0.01*s, 0.00*s));
  position.push(new Vec3f(-0.01*s,-0.01*s, 0.00*s));
  index.push(new Vec3i(offset_I+3, offset_I+4, offset_I+5));
  index.push(new Vec3i(offset_I+3, offset_I+5, offset_I+4));

  index.push(new Vec3i(offset_I+1, offset_I+2, offset_I+4));
  index.push(new Vec3i(offset_I+2, offset_I+5, offset_I+4));
  index.push(new Vec3i(offset_I+1, offset_I+4, offset_I+2));
  index.push(new Vec3i(offset_I+2, offset_I+4, offset_I+5));

  position.push(new Vec3f( 0.00*s, 0.10*s, 0.00*s));
  position.push(new Vec3f( 0.01*s, 0.01*s, 0.00*s));
  position.push(new Vec3f(-0.01*s, 0.01*s, 0.00*s));
  index.push(new Vec3i(offset_I+6, offset_I+7, offset_I+8));
  index.push(new Vec3i(offset_I+6, offset_I+8, offset_I+7));

  position.push(new Vec3f( 0.00*s,-0.10*s, 0.00*s));
  position.push(new Vec3f( 0.01*s,-0.01*s, 0.00*s));
  position.push(new Vec3f(-0.01*s,-0.01*s, 0.00*s));
  index.push(new Vec3i(offset_I+9, offset_I+10, offset_I+11));
  index.push(new Vec3i(offset_I+9, offset_I+11, offset_I+10));
}

function onLoad() {
  canvas = document.getElementById("canvas");
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  gl = canvas.getContext("webgl2");

  camera = new PerspectiveCamera();
  camera.alpha = 180;
  camera.beta = 0;
  camera.cameraLength = 8;

  shader3D.setup();

  Tree = new GLObject();
  position = []
  index = []
  AddCone(position, index, 1, 2, 1);
  AddCone(position, index, 0.3, 1.5, 1.2);
  AddCone(position, index, -0.5, 0.9, 1.4);
  AddCone(position, index, -1.4, 0.2, 1.6);
  AddCone(position, index, -2.4, -0.6, 1.8);
  Tree.vertex["position"]=position;
  Tree.index=index;
  Tree.setup();
  Tree.uniform["colorAmbientLight"] = new Vec3f(0.5, 0.5, 0.5);
  Tree.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
  Tree.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
  Tree.uniform["mMatrix"] = new Mat4f();
  Tree.uniform["colorSrc"] = new Vec4f(0.1, 0.5, 0.2, 1.0);

  Block = new GLObject();
  position = []
  index = []
  AddTube(position, index, -4, -2.4, 0.3);
  Block.vertex["position"]=position;
  Block.index=index;
  Block.setup();
  Block.uniform["colorAmbientLight"] = new Vec3f(0.8, 0.8, 0.8);
  Block.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
  Block.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
  Block.uniform["mMatrix"] = new Mat4f();
  Block.uniform["colorSrc"] = new Vec4f(0.3, 0.1, 0.1, 1.0);

  for(let i=0; i<NUMCRYSTAL; i++){
    Crystal = new GLObject();
    position = []
    index = []
    MakeCrystal(position, index, 1+Math.random());
    Crystal.vertex["position"]=position;
    Crystal.index=index;
    Crystal.setup();
    Crystal.uniform["colorAmbientLight"] = new Vec3f(1.0, 1.0, 1.0);
    Crystal.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
    Crystal.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
    CrystalsPlace.push(new Vec3f(Math.random()*10-5, Math.random()*10-5, Math.random()*10-5));
    CrystalsRotation.push(Math.random()*360);
    Crystal.uniform["mMatrix"] = Mat4f.translation(CrystalsPlace[i]).times(Mat4f.rotationY(CrystalsRotation[i]));
    let a=Math.random();
    if(a < 0.25){
      Crystal.uniform["colorSrc"] = new Vec4f(0.4, 0.7, 1.0, 1.0);
    }
    else if(a < 0.50){
      Crystal.uniform["colorSrc"] = new Vec4f(1.0, 1.0, 0.6, 1.0);
    }
    else if(a < 0.75){
      Crystal.uniform["colorSrc"] = new Vec4f(0.6, 1.0, 1.0, 1.0);
    }
    else{
      Crystal.uniform["colorSrc"] = new Vec4f(0.9, 0.9, 0.9, 1.0);
    }
    Crystals.push(Crystal);
  }

  Star1 = new GLObject();
  position = []
  index = []
  MakeCrystal(position, index, 5);
  Star1.vertex["position"]=position;
  Star1.index=index;
  Star1.setup();
  Star1.uniform["colorAmbientLight"] = new Vec3f(1.0, 1.0, 1.0);
  Star1.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
  Star1.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
  Star1.uniform["mMatrix"] = Mat4f.translation(new Vec3f(0, 2.5, 0)).times(Mat4f.rotationY(Star1Rotation));
  Star1.uniform["colorSrc"] = new Vec4f(1.0, 1.0, 0.0, 1.0);

    Star2 = new GLObject();
    position = []
    index = []
    MakeCrystal(position, index, 5);
    Star2.vertex["position"]=position;
    Star2.index=index;
    Star2.setup();
    Star2.uniform["colorAmbientLight"] = new Vec3f(1.0, 1.0, 1.0);
    Star2.uniform["colorDirectionalLight"] = new Vec3f(1.0, 1.0, 1.0);
    Star2.uniform["vectorDirectionalLight"] = new Vec3f(0.1, 1.0, 0.5);
    Star2.uniform["mMatrix"] = Mat4f.translation(new Vec3f(0, 2.5, 0)).times(Mat4f.rotationY(Star2Rotation));
    Star2.uniform["colorSrc"] = new Vec4f(1.0, 1.0, 0.0, 1.0);


  setClearColor(new Vec4f(0.0, 0.0, 0.0, 0.0));
  setClearDepth();
  enableDepthTest();
  enableCullFace();
  enableBlend();

  onResize();
  onLoop();
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
  onDraw();
  setTimeout(onLoop, 30);
}

function onDraw(){
  setFramebuffer(null);
  setViewport(canvassize[0], canvassize[1]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Tree.uniform["vpMatrix"] = camera.getVPMatrix();
  if(shader3D.colorFlatLighting.use()){
    Tree.onDraw(shader3D.colorFlatLighting);
    Block.onDraw(shader3D.colorFlatLighting);
    for(let i=0; i<NUMCRYSTAL; i++){
      CrystalsRotation[i]+=15
      let a = CrystalsPlace[i].data[1];
      a-=0.025*(1+2*i/NUMCRYSTAL);
      if(a < -5){
        a+=10;
      }
      CrystalsPlace[i].data[1]=a;
      Crystals[i].uniform["mMatrix"] = Mat4f.translation(CrystalsPlace[i]).times(Mat4f.rotationY(CrystalsRotation[i]));
      Crystals[i].onDraw(shader3D.colorFlatLighting);
    }
    Star1.uniform["mMatrix"] = Mat4f.translation(new Vec3f(0, 2.5, 0)).times(Mat4f.rotationY(Star1Rotation));
    Star1Rotation+=10;
    Star1Rotation%=360;
    Star1.onDraw(shader3D.colorFlatLighting);
    Star2.uniform["mMatrix"] = Mat4f.translation(new Vec3f(0, 2.5, 0)).times(Mat4f.rotationY(Star2Rotation)).times(Mat4f.rotationZ(45));
    Star2Rotation-=10;
    Star2Rotation%=360;
    Star2.onDraw(shader3D.colorFlatLighting);
  }

  gl.flush();
}
