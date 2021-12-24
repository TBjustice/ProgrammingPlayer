var gl;
//WebGL Settings
function setViewport(w, h){
  gl.viewport(0, 0, w, h);
}
function setClearColor(color=new Vec4f()) {
  gl.clearColor(color.data[0], color.data[1], color.data[2], color.data[3]);
}
function setClearDepth(depth=1) {
  gl.clearDepth(depth);
}
function enableDepthTest(fun = gl.LEQUAL){
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(fun);
}
function disableDepthTest(){
  gl.disable(gl.DEPTH_TEST);
}
function enableBlend(funs = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]){
  gl.enable(gl.BLEND);
  gl.blendFunc(funs[0], funs[1]);
}
function disableBlend(){
  gl.disable(gl.BLEND);
}
function enableCullFace(ccw = true){
  gl.enable(gl.CULL_FACE);
  if(ccw){
    gl.frontFace(gl.CCW);
  }
  else{
    gl.frontFace(gl.CW);
  }
}
function disableCullFace(){
  gl.disable(gl.CULL_FACE);
}

//Math
function toRadians(deg){
  return deg*Math.PI/180;
}
function createGaussian(sigma=1, n=5){
  let result = [];
  for(let x=0; x<n; x++){
    result.push(0.39894*Math.exp(-(x*x)/(2*sigma*sigma)));
  }
  return result;
}
function Vec2f(x=0, y=0){
  this.data = [x, y];
}
function Vec3f(x=0, y=0, z=0){
  this.data = [x, y, z];
}
function Vec3i(x=0, y=0, z=0){
  this.data = [x, y, z];
}
function Vec4f(x=0, y=0, z=0, w=0){
  this.data = [x, y, z, w];
}
function VecNf(src){
  this.data = new Float32Array(src);
}
class Mat4f{
  constructor(element0 = 1, element1 = 0, element2 = 0, element3 = 0, element4 = 0, element5 = 1, element6 = 0, element7 = 0, element8 = 0, element9 = 0, element10 = 1, element11 = 0, element12 = 0, element13 = 0, element14 = 0, element15 = 1) {
    this.element0 = element0;
    this.element1 = element1;
    this.element2 = element2;
    this.element3 = element3;
    this.element4 = element4;
    this.element5 = element5;
    this.element6 = element6;
    this.element7 = element7;
    this.element8 = element8;
    this.element9 = element9;
    this.element10 = element10;
    this.element11 = element11;
    this.element12= element12;
    this.element13 = element13;
    this.element14 = element14;
    this.element15 = element15;
  }
  plus(b) {
    this.element0 += b.element0;
    this.element1 += b.element1;
    this.element2 += b.element2;
    this.element3 += b.element3;
    this.element4 += b.element4;
    this.element5 += b.element5;
    this.element6 += b.element6;
    this.element7 += b.element7;
    this.element8 += b.element8;
    this.element9 += b.element9;
    this.element10 += b.element10;
    this.element11 += b.element11;
    this.element12 += b.element12;
    this.element13 += b.element13;
    this.element14 += b.element14;
    this.element15 += b.element15;
    return this;
  }

  minus(b) {
    this.element0 -= b.element0;
    this.element1 -= b.element1;
    this.element2 -= b.element2;
    this.element3 -= b.element3;
    this.element4 -= b.element4;
    this.element5 -= b.element5;
    this.element6 -= b.element6;
    this.element7 -= b.element7;
    this.element8 -= b.element8;
    this.element9 -= b.element9;
    this.element10 -= b.element10;
    this.element11 -= b.element11;
    this.element12 -= b.element12;
    this.element13 -= b.element13;
    this.element14 -= b.element14;
    this.element15 -= b.element15;
    return this;
  }

  times(b) {
    let buf = [
      this.element0 * b.element0 + this.element4 * b.element1 + this.element8 * b.element2 + this.element12 * b.element3,
      this.element1 * b.element0 + this.element5 * b.element1 + this.element9 * b.element2 + this.element13 * b.element3,
      this.element2 * b.element0 + this.element6 * b.element1 + this.element10 * b.element2 + this.element14 * b.element3,
      this.element3 * b.element0 + this.element7 * b.element1 + this.element11 * b.element2 + this.element15 * b.element3,
      this.element0 * b.element4 + this.element4 * b.element5 + this.element8 * b.element6 + this.element12 * b.element7,
      this.element1 * b.element4 + this.element5 * b.element5 + this.element9 * b.element6 + this.element13 * b.element7,
      this.element2 * b.element4 + this.element6 * b.element5 + this.element10 * b.element6 + this.element14 * b.element7,
      this.element3 * b.element4 + this.element7 * b.element5 + this.element11 * b.element6 + this.element15 * b.element7,
      this.element0 * b.element8 + this.element4 * b.element9 + this.element8 * b.element10 + this.element12 * b.element11,
      this.element1 * b.element8 + this.element5 * b.element9 + this.element9 * b.element10 + this.element13 * b.element11,
      this.element2 * b.element8 + this.element6 * b.element9 + this.element10 * b.element10 + this.element14 * b.element11,
      this.element3 * b.element8 + this.element7 * b.element9 + this.element11 * b.element10 + this.element15 * b.element11,
      this.element0 * b.element12 + this.element4 * b.element13 + this.element8 * b.element14 + this.element12 * b.element15,
      this.element1 * b.element12 + this.element5 * b.element13 + this.element9 * b.element14 + this.element13 * b.element15,
      this.element2 * b.element12 + this.element6 * b.element13 + this.element10 * b.element14 + this.element14 * b.element15,
      this.element3 * b.element12 + this.element7 * b.element13 + this.element11 * b.element14 + this.element15 * b.element15
    ];
    this.element0 = buf[0];
    this.element1 = buf[1];
    this.element2 = buf[2];
    this.element3 = buf[3];
    this.element4 = buf[4];
    this.element5 = buf[5];
    this.element6 = buf[6];
    this.element7 = buf[7];
    this.element8 = buf[8];
    this.element9 = buf[9];
    this.element10 = buf[10];
    this.element11 = buf[11];
    this.element12= buf[12];
    this.element13 = buf[13];
    this.element14 = buf[14];
    this.element15 = buf[15];
    return this;
  }

  toFloatArray(){
    return new Float32Array([this.element0, this.element1, this.element2, this.element3, this.element4, this.element5, this.element6, this.element7, this.element8, this.element9, this.element10, this.element11, this.element12, this.element13, this.element14, this.element15]);
  }

  static rotationX(deg){
    return new Mat4f(
      1, 0, 0, 0,
      0, Math.cos(toRadians(deg)), Math.sin(toRadians(deg)), 0,
      0, -Math.sin(toRadians(deg)), Math.cos(toRadians(deg)), 0,
      0, 0, 0, 1
    );
  }

  static rotationY(deg){
    return new Mat4f(
      Math.cos(toRadians(deg)), 0, -Math.sin(toRadians(deg)), 0,
      0, 1, 0, 0,
      Math.sin(toRadians(deg)), 0, Math.cos(toRadians(deg)), 0,
      0, 0, 0, 1
    );
  }

  static rotationZ(deg){
    return new Mat4f(
      Math.cos(toRadians(deg)), Math.sin(toRadians(deg)), 0, 0,
      -Math.sin(toRadians(deg)), Math.cos(toRadians(deg)), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  static translation(vec){
    return new Mat4f(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      vec.data[0], vec.data[1], vec.data[2], 1
    );
  }

  static scale(vec){
    return new Mat4f(
      vec.data[0], 0, 0, 0,
      0, vec.data[1], 0, 0,
      0, 0, vec.data[2], 0,
      0, 0, 0, 1
    );
  }

  static createVMatrix(center=new Vec3f(0, 0, 0), alphDeg=0, betaDeg=0, length){
    const alph = toRadians(alphDeg)
    const beta = toRadians(betaDeg)
    const cameraX = center.data[0] + length * Math.cos(beta) * Math.sin(alph)
    const cameraY = center.data[1] + length * Math.sin(beta)
    const cameraZ = center.data[2] + length * Math.cos(beta) * Math.cos(alph)
    let result = this.rotationX(betaDeg);
    result.times(this.rotationY(-alphDeg));
    result.times(this.translation(new Vec3f(-cameraX, -cameraY, -cameraZ)));
    return result;
  }
  static createPMatrix(fovy=90, aspect=1, near=0.1, far=100) {
    const t = near * Math.tan(toRadians(fovy) / 2);
    const r = t * aspect;
    const a = r * 2;
    const b = t * 2;
    const c = far - near;
    return new Mat4f(
      near * 2 / a,
      0,
      0,
      0,
      0,
      near * 2 / b,
      0,
      0,
      0,
      0,
      -(far + near) / c,
      -1,
      0,
      0,
      -(far * near * 2) / c,
      0
    );
  }
}

//GLSLProgram
function GLSLProgram() {
  this.program = 0;
  this.uniLoc = {};
  this.uniType = {};
  this.uniSize = {};
  this.attLoc = {};
  this.attType = {};
  this.attSize = {};
}
GLSLProgram.prototype.createShader = function(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders : " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
GLSLProgram.prototype.createProgram = function(sourceCode) {
  this.uniLoc = {};
  this.uniType = {};
  this.uniSize = {};
  this.attLoc = {};
  this.attType = {};
  this.attSize = {};
  this.attStride = {};
  const vertexShader = this.createShader(gl.VERTEX_SHADER, sourceCode[0]);
  const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, sourceCode[1]);
  this.program = gl.createProgram();
  gl.attachShader(this.program, vertexShader);
  gl.attachShader(this.program, fragmentShader);
  gl.linkProgram(this.program);
  if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program : " + gl.getProgramInfoLog(this.program));
    this.program = 0;
    return;
  }
  gl.useProgram(this.program);
  const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttribs; ++i) {
    const info = gl.getActiveAttrib(this.program, i);
    this.attLoc[info.name] = gl.getAttribLocation(this.program, info.name);
    this.attType[info.name] = info.type;
    this.attSize[info.name] = info.size;
    switch(info.type){
      case gl.FLOAT:
      this.attStride[info.name] = 1;
      break;
      case gl.FLOAT_VEC2:
      this.attStride[info.name] = 2;
      break;
      case gl.FLOAT_VEC3:
      this.attStride[info.name] = 3;
      break;
      case gl.FLOAT_VEC4:
      this.attStride[info.name] = 4;
      break;
      case gl.FLOAT_MAT2:
      this.attStride[info.name] = 4;
      break;
      case gl.FLOAT_MAT3:
      this.attStride[info.name] = 9;
      break;
      case gl.FLOAT_MAT4:
      this.attStride[info.name] = 16;
      break;
    }
  }
  const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; ++i) {
    const info = gl.getActiveUniform(this.program, i);
    this.uniLoc[info.name] = gl.getUniformLocation(this.program, info.name);
    this.uniType[info.name] = info.type;
    this.uniSize[info.name] = info.size;
  }
  gl.useProgram(null);
  //console.log(this.uniType, this.uniSize);
}
GLSLProgram.prototype.use = function() {
  if(this.program == 0){
    return false;
  }
  else{
    gl.useProgram(this.program);
    return true;
  }
}
GLSLProgram.prototype.setVBO = function(name, VBO) {
  if(name in this.attLoc){
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.enableVertexAttribArray(this.attLoc[name]);
    gl.vertexAttribPointer(this.attLoc[name], this.attStride[name], gl.FLOAT, false, 0, 0);
  }
}
GLSLProgram.prototype.setIBO = function(IBO) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
}
GLSLProgram.prototype.setUniform = function(name, uni){
  switch(this.uniType[name]){
    case gl.BOOL:
    gl.uniform1i(this.uniLoc[name], uni>0);
    break;
    case gl.FLOAT:
    if(this.uniSize[name] > 1){
      gl.uniform1fv(this.uniLoc[name], uni.data);
    }
    else{
      gl.uniform1f(this.uniLoc[name], uni);
    }
    break;
    case gl.FLOAT_VEC2:
    gl.uniform2f(this.uniLoc[name], uni.data[0], uni.data[1]);
    break;
    case gl.FLOAT_VEC3:
    gl.uniform3f(this.uniLoc[name], uni.data[0], uni.data[1], uni.data[2]);
    break;
    case gl.FLOAT_VEC4:
    gl.uniform4f(this.uniLoc[name], uni.data[0], uni.data[1], uni.data[2], uni.data[3]);
    break;
    case gl.FLOAT_MAT2:
    gl.uniformMatrix4fv(this.uniLoc[name], false, uni.toFloatArray());
    break;
    case gl.FLOAT_MAT3:
    gl.uniformMatrix4fv(this.uniLoc[name], false, uni.toFloatArray());
    break;
    case gl.FLOAT_MAT4:
    gl.uniformMatrix4fv(this.uniLoc[name], false, uni.toFloatArray());
    break;
    case gl.SAMPLER_2D:
    gl.uniform1i(this.uniLoc[name], uni);
    break;
  }
}

//FrameBuffer
function createFramebuffer(width, height){
  var frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  var depthRenderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
  var fTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return {framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: fTexture, bufferlist:[gl.COLOR_ATTACHMENT0]};
}
function createFramebuffers(width, height, count) {
  var frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  var fTextures = [];
  let bufferList = [];
  for(var i = 0; i < count; ++i){
    fTextures[i] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fTextures[i]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, fTextures[i], 0);
    bufferList.push(gl.COLOR_ATTACHMENT0 + i);
  }
  var depthRenderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return {
    framebuffer: frameBuffer,
    renderbuffer: depthRenderBuffer,
    textures: fTextures,
    bufferlist:bufferList
  };
}
function setFramebuffer(framebuffer){
  if(framebuffer == null){
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  else{
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
    gl.drawBuffers(framebuffer.bufferlist);
  }
}

//ImageTexture
function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
async function loadImageTexture(src){
  let img = await loadImage(src).catch(e => {
    console.log('onload error', e);
  });
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

//GLObjects
class GLObject{
  _VBO={};
  _IBO=[];
  _length = 0;
  constructor(){
    this.uniform = {};
    this.vertex={};
    this.index=[];
  }
  setup(){
    for(let v_name in this.vertex){
      let bufdata = [];
      let v = this.vertex[v_name];
      for(let data of v){
        for(let d of data.data){
          bufdata.push(d);
        }
      }
      this._VBO[v_name] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this._VBO[v_name]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufdata), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    let bufdata = [];
    for(let p of this.index){
      for(let d of p.data){
        bufdata.push(d);
      }
    }
    this._IBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._IBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(bufdata), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this._length = this.index.length*3
  }
  onDraw(program){
    for(let u_name in this.uniform){
      program.setUniform(u_name, this.uniform[u_name]);
    }
    for(let v_name in this.vertex){
      program.setVBO(v_name, this._VBO[v_name]);
    }
    program.setIBO(this._IBO);
    gl.drawElements(gl.TRIANGLES, this._length, gl.UNSIGNED_SHORT, 0);
  }
}

function createWholeRect(){
  let result = new GLObject();
  position = []
  position.push(new Vec3f(1, 1, -1));
  position.push(new Vec3f(1, -1, -1));
  position.push(new Vec3f(-1, 1, -1));
  position.push(new Vec3f(-1, -1, -1));
  result.vertex["position"] = position;
  uv = []
  uv.push(new Vec2f(1, 1));
  uv.push(new Vec2f(1, 0));
  uv.push(new Vec2f(0, 1));
  uv.push(new Vec2f(0, 0));
  result.vertex["uv"] = uv;
  result.index.push(new Vec3i(3, 1, 2));
  result.index.push(new Vec3i(0, 2, 1));
  result.setup();
  return result;
}

const shader3D = {
  _solidPaint: [
    `#version 300 es
    in vec3 position;
    uniform mat4 vpMatrix;
    uniform mat4 mMatrix;
    void main(){
      gl_Position = vpMatrix * mMatrix*vec4(position, 1.0);
    }
    //****************************************************************************
    `
    ,
    `#version 300 es
    precision highp float;
    //****************************************************************************
    uniform vec4 color;
    out vec4 outcolor;
    void main() {
      outcolor = color;
    }
    //****************************************************************************
    `
  ],
  solidPaint: new GLSLProgram(),
  _texturePaint: [
    `#version 300 es
    in vec3 position;
    in vec2 uv;
    uniform mat4 vpMatrix;
    uniform mat4 mMatrix;
    out vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vpMatrix * mMatrix*vec4(position, 1.0);
    }
    //****************************************************************************
    `
    ,
    `#version 300 es
    precision highp float;
    //****************************************************************************
    in vec2 vUv;
    uniform sampler2D textureSrc;
    out vec4 outcolor;
    void main() {
      outcolor = texture(textureSrc, vUv);
    }
    //****************************************************************************
    `
  ],
  texturePaint: new GLSLProgram(),
  _checkFlatNormal:[
    `#version 300 es
    in vec3 position;
    uniform mat4 vpMatrix;
    uniform mat4 mMatrix;
    out vec3 vPosition;
    void main(){
      vPosition = (mMatrix*vec4(position, 1.0)).xyz;
      gl_Position = vpMatrix * mMatrix*vec4(position, 1.0);
    }
    //****************************************************************************
    `
    ,
    `#version 300 es
    precision highp float;
    //****************************************************************************
    in vec3 vPosition;
    out vec4 outcolor;
    void main() {
      vec3 nx = dFdx(vPosition);
      vec3 ny = dFdy(vPosition);
      vec3 n = normalize(cross(normalize(nx), normalize(ny)));
      outcolor = vec4(abs(n), 1.0);
    }
    //****************************************************************************
    `
  ],
  checkFlatNormal: new GLSLProgram(),
  _textureFlatLighting:[
    `#version 300 es
    in vec3 position;
    in vec2 uv;
    uniform mat4 vpMatrix;
    uniform mat4 mMatrix;
    out vec3 vPosition;
    out vec2 vUv;
    void main(){
      vUv = uv;
      vPosition = (mMatrix*vec4(position, 1.0)).xyz;
      gl_Position = vpMatrix * mMatrix*vec4(position, 1.0);
    }
    //****************************************************************************
    `
    ,
    `#version 300 es
    precision highp float;
    //****************************************************************************
    in vec3 vPosition;
    in vec2 vUv;
    uniform sampler2D textureSrc;
    uniform vec3 colorAmbientLight;
    uniform vec3 colorDirectionalLight;
    uniform vec3 vectorDirectionalLight;
    out vec4 outcolor;
    void main() {
      vec3 nx = dFdx(vPosition);
      vec3 ny = dFdy(vPosition);
      vec3 normal = normalize(cross(normalize(nx), normalize(ny)));
      float directional = clamp(dot(normal, vectorDirectionalLight), 0.0, 1.0);
      vec3 lightcolor = colorDirectionalLight * directional + colorAmbientLight;
      outcolor = texture(textureSrc, vUv) * vec4(lightcolor, 1.0);
    }
    //****************************************************************************
    `
  ],
  textureFlatLighting: new GLSLProgram(),
  _colorFlatLighting:[
    `#version 300 es
    in vec3 position;
    uniform mat4 vpMatrix;
    uniform mat4 mMatrix;
    out vec3 vPosition;
    void main(){
      vPosition = (mMatrix*vec4(position, 1.0)).xyz;
      gl_Position = vpMatrix*mMatrix*vec4(position, 1.0);
    }
    //****************************************************************************
    `
    ,
    `#version 300 es
    precision highp float;
    //****************************************************************************
    in vec3 vPosition;
    uniform vec4 colorSrc;
    uniform vec3 colorAmbientLight;
    uniform vec3 colorDirectionalLight;
    uniform vec3 vectorDirectionalLight;
    out vec4 outcolor;
    void main() {
      vec3 nx = dFdx(vPosition);
      vec3 ny = dFdy(vPosition);
      vec3 normal = normalize(cross(normalize(nx), normalize(ny)));
      float directional = clamp(dot(normal, vectorDirectionalLight), 0.0, 1.0);
      vec3 lightcolor = colorDirectionalLight * directional + colorAmbientLight;
      outcolor = colorSrc * vec4(lightcolor, 1.0);
    }
    //****************************************************************************
    `
  ],
  colorFlatLighting: new GLSLProgram(),
  setup: function(){
    this.solidPaint.createProgram(this._solidPaint);
    this.texturePaint.createProgram(this._texturePaint);
    this.checkFlatNormal.createProgram(this._checkFlatNormal);
    this.textureFlatLighting.createProgram(this._textureFlatLighting);
    this.colorFlatLighting.createProgram(this._colorFlatLighting);
  }
}
