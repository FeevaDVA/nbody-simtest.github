'use strict';
(function(){
    const FrameDelayMillis = 10;
    const BodyMass = .01;
    const CentralMass = 10;
    const G = 0.5
    const BodyRadius = 1
    const PPM = 10
    const iOrigin = 400;
    const jOrigin = 100;
    const CentralRadius = 5

    var sim

   var Vector = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
   };
   Vector.prototype = {
    constructor: Vector,
    set: function (set) {
        if (typeof set == "object"){
            this.x = set.x;
            this.y = set.y;
        } else {
            this.x = set;
            this.y = set;
        }
        return this;
    },
    equals: function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    },
    clone: function () {
        return new Vector(this.x, this.y);
    },
    mul: function (mul) {
        if (typeof mul === "object") {
            return new Vector(this.x * mul.x, this.y * mul.y);
        } else {
            return new Vector(this.x * mul, this.y * mul);
        }
    },
    div: function (div) {
        return new Vector(this.x / div, this.y / div);
    },
    add: function (add) {
        if (typeof add === "object") {
            return new Vector(this.x + add.x, this.y + add.y);
        } else {
            return new Vector(this.x + add, this.y + add);
        }
    },
    sub: function (sub) {
        if (typeof sub === "object") {
            return new Vector(this.x - sub.x, this.y - sub.y);
        } else {
            return new Vector(this.x - sub, this.y - sub);
        }
    },
    reverse: function () {
        return this.mul(-1);
    },
    abs: function () {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    },
    dot: function (v) {
        return (this.x * v.x + this.y * v.y);
    },
    length: function () {
        return Math.sqrt(this.dot(this));
    },
    lengthSq: function () {
        return this.dot(this);
    },
    setLength: function (l) {
        return this.normalize().mul(l);
    },
    lerp: function (v, s) {
        return new Vector(this.x + (v.x - this.x) * s, this.y + (v.y - this.y) * s);
    },
    normalize: function () {
        return this.div(this.length());
    },
    truncate: function (max) {
        if (this.length() > max) {
            return this.normalize().mul(max);
        } else {
            return this;
        }
    },
    dist: function (v) {
        return Math.sqrt(this.distSq(v));
    },
    distSq: function (v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
    },
    cross: function (v) {
        return this.x * v.y - this.y * v.x;
    }
};
   

    class Body{
        constructor(x, y, vX, vY, fX, fY, mass, color){
            
            this.vec = new Vector(x, y);
            
            this.fVec = new Vector(fX, fY);

            this.vVec = new Vector(vX, vY);

            this.mass = mass;

            this.color = color;
        }
        toString(){
            return this.vec + " " + this.fVec
        }
    }

    class Simulation {
        constructor(){
            this.bodyList = [];
        }

        addBody(b){
            this.bodyList.push(b);
            return b;
        }

        addForce(){
            for (var i = 0; i < this.bodyList.length; i++) {
                var p = this.bodyList[i];
                p.fVec.set(0);
        
                for (var j = 0; j < i; j++) {
                    var OtherBody = this.bodyList[j]

                    var d = p.vec.sub(OtherBody.vec);
                    var norm = Math.sqrt(100.0 + d.lengthSq());
                    var mag = G / (norm * norm * norm);
        
                    p.fVec.set(p.fVec.sub(d.mul(mag * OtherBody.mass)));
                    OtherBody.fVec.set(OtherBody.fVec.add(d.mul(mag * p.mass)));
        
                }
            }
        }

        update(dT){
            
            for (var i1 = 0; i1 < this.bodyList.length; i1++) {
                var p1 = this.bodyList[i1];
                p1.vec.set(p1.vec.add(p1.vVec.mul(0.5 * dT)));
            }
            this.addForce()
            for (var i2 = 0; i2 < this.bodyList.length; i2++) {
                var p2 = this.bodyList[i2];
                p2.vVec.set(p2.vVec.add(p2.fVec.mul(dT)));
            }
            for (var i3 = 0; i3 < this.bodyList.length; i3++) {
                var p3 = this.bodyList[i3];
                p3.vec.set(p3.vec.add(p3.vVec.mul(0.5 * dT)));
                console.log(p3.vec.x + " " + p3.vec.y)
            }
        }

        start(){
            var central = new Body(0, -25, 0, 0, 0, 0, 20, 'Red');
            var b = new Body(0, 0, 1, -1, 1, -1, BodyMass, 'Green');
            this.addBody(central);
            //this.addBody(b);
        }
    }

    function init(){
        let sim = new Simulation();
        return sim;
    }

    function ScreenHor(x) {
        return iOrigin + (PPM * x);
    }

    function ScreenVer(y) {
        return jOrigin - (PPM * y);
    }

    function WorldX(hor) {
        return (hor - iOrigin) / PPM;
    }

    function WorldY(ver) {
        return (jOrigin - ver) / PPM;
    }

    function render(sim){
        const canvas = document.getElementById('SimCanvas');
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        context.strokeStyle ='000'
        context.lineWidth = 1;
        for(let b of sim.bodyList){
            if (b.color == 'Green'){
                context.fillStyle ='#8f0';
                context.beginPath();
                context.arc(ScreenHor(b.vec.x), ScreenVer(b.vec.y), (BodyRadius*PPM), 0, 2*Math.PI, true);
                context.fill();
                context.stroke();
            } else {
                context.fillStyle ='#f80';
                context.beginPath();
                context.arc(ScreenHor(b.vec.x), ScreenVer(b.vec.y), (CentralRadius*PPM), 0, 2*Math.PI, true);
                context.fill();
                context.stroke();
            }
        }
    }

    function AnimationFrame(){
        for (var k = 0; k < 4; k++) {
            sim.update(1.0/5);
        }
        render(sim);
        window.setTimeout(AnimationFrame, FrameDelayMillis);
    }
    var x1;
    var y1;
    function OnMouseDown(evt) {
        const canvas = document.getElementById('SimCanvas');
        x1 = evt.pageX - canvas.offsetLeft;
        y1 = evt.pageY - canvas.offsetTop;
        console.log("sup");
    }

    var x2;
    var y2;
    function OnMouseUp(evt) {
        const canvas = document.getElementById('SimCanvas');
        x2 = evt.pageX - canvas.offsetLeft;
        y2 = evt.pageY - canvas.offsetTop;
        const x = WorldX(x1)
        const y = WorldY(y1)
        const v1 = new Vector(x1, y1)
        const v2 = new Vector(x2, y2)
        const dist = v1.dist(v2)
        var b = new Body(x, y, dist*(x1 - x2), dist*(y1 - y2), 0, 0, BodyMass, 'Green');
        this.addBody(b)
    }
    
    window.onload = function() {
        sim = init();
        const canvas = document.getElementById('SimCanvas');
        canvas.addEventListener('mousedown', OnMouseDown);
        canvas.addEventListener('mouseup', OnMouseUp);
        console.log("bruhg");
        sim.start();
        AnimationFrame();
    }
})();