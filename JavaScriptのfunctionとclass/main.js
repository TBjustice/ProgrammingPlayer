function Person(name, id){
  this.name = name;
  this.id = id;
  this.printData = function(){
    console.log("ID" + this.id + ":" + name);
  }
}

let person1 = new Person("Taro", 1);
let person2 = new Person("Hanako", 2);
person1.printData();
person2.printData();


function TestFunction(){
  this.a=0;
  var b=1;
  this.A = function(){
    console.log("I am TestFunction.A()  a=" + this.a);
  };
    this.B = function () {
        console.log("I am TestFunction.B()  b=" + b);
    };
}

class TestClass{
  #b;
  constructor(){
    this.a=0
    this.#b=1;
  }
  A(){
    console.log("I am TestClass.A()  a=" + this.a);
  }
  B(){
    console.log("I am TestClass.B()  #b=" + this.#b);
  }
}

let testFunction = new TestFunction();
console.log("testFunction.a=" + testFunction.a);
console.log("testFunction.b=" + testFunction.b);
testFunction.A();
testFunction.B();

let testClass = new TestClass();
console.log("testClass.a=" + testClass.a);
console.log("testClass.b=" + testClass.b);
//console.log("testClass.#b=" + testClass.#b);//This will raise Error!
testClass.A();
testClass.B();
