
//Camera
function Camera(){
  this._vMatrix = new Mat4f();
  this._pMatrix = new Mat4f();
  this._vpMatrix = new Mat4f();
}
Camera.prototype.setVMatrix = function(vMatrix){
  this._vMatrix = vMatrix;
  this._vpMatrix = new Mat4f();
  this._vpMatrix.times(this._pMatrix);
  this._vpMatrix.times(this._vMatrix);
};
Camera.prototype.setPMatrix = function(pMatrix){
  this._pMatrix = pMatrix;
  this._vpMatrix = new Mat4f();
  this._vpMatrix.times(this._pMatrix);
  this._vpMatrix.times(this._vMatrix);
};
Camera.prototype.getVPMatrix = function(){
  return this._vpMatrix;
};

class PerspectiveCamera{
  #a;
  #b;
  #f;
  #asp;
  #l;
  #vMat;
  #pMat;
  #vpMat;
  #c;
  #cl;
  constructor(){
    this.#a = 0;
    this.alpha = 0;

    this.#b = 0;
    this.beta = 0;

    this.#f = 90;
    this.fovy = 90;

    this.#asp = 1;
    this.aspect = 1;

    this.#l = [0.1, 100];
    this.limit = [0.1, 100];

    this.#c = new Vec3f();
    this.center = new Vec3f();

    this.#cl = 1;
    this.cameraLength = 1;

    this.compile();
  }
  compile(){
    this.#vMat = Mat4f.createVMatrix(this.#c, this.#a, this.#b, this.#cl);
    this.#pMat = Mat4f.createPMatrix(this.#f, this.#asp, this.#l[0], this.#l[1]);
    this.#vpMat = new Mat4f();
    this.#vpMat.times(this.#pMat);
    this.#vpMat.times(this.#vMat);
  }
  getVPMatrix(){
    if(
      this.#a != this.alpha ||
      this.#b != this.beta ||
      this.#f != this.fovy ||
      this.#asp != this.aspect ||
      this.#l[0] != this.limit[0] || this.#l[1] != this.limit[1] ||
      this.#c.data[0] != this.center.data[0] || this.#c.data[1] != this.center.data[1] || this.#c.data[2] != this.center.data[2] ||
      this.#cl != this.cameraLength
    )
    {
      this.#a = this.alpha;
      this.#b = this.beta;
      this.#f = this.fovy;
      this.#asp = this.aspect;
      this.#l[0] = this.limit[0];
      this.#l[1] = this.limit[1];
      this.#c.data[0] = this.center.data[0];
      this.#c.data[1] = this.center.data[1];
      this.#c.data[2] = this.center.data[2];
      this.#cl = this.cameraLength;
      this.compile();
    }
    return this.#vpMat;
  }
}
