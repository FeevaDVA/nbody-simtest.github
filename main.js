'use strict';
(function(){
    const FrameDelayMillis = 10;
    const BodyMass = 1;
    const CentralMass = 10;
    const G = 0.5
    const BodyRadius = 1
    const PPM = 10
    const iOrigin = 400;
    const jOrigin = 100;
    const CentralRadius = 5

    var sim

    class Body{
        constructor(x, y, vX, vY, fX, fY, mass, color){
            
            this.x = x;
            this.y = y;
            
            this.vX = vX;
            this.vY = vY;

            this.fX = fX;
            this.fY = fY;

            this.mass = mass;

            this.color = color;
        }

        update(dT) {
            this.x = this.x+this.vX * dT * 0.5;
            this.y = this.y+this.vY * dT * 0.5;;
        }

        distance(OtherBody){
            var dX = Math.abs(this.x - OtherBody.x);
            var dY = Math.abs(this.y - OtherBody.y);
            return dX*dY + dY*dY;
        }

        reset(){
            this.fX = 0.0;
            this.fY = 0.0;
        }

        addForce(OtherBody){
            var d = this.distance(OtherBody);
            var norm = Math.sqrt(100.0 + d);

            var mag = G / (norm * norm * norm);

            var dX = this.x - OtherBody.x;
            var dY = this.y - OtherBody.y;

            var temp = dX
            var temp2 = dY;
            console.log(temp)
            this.fX = this.fX - temp*mag*OtherBody.mass;
            this.fY = this.fY - temp2*mag*OtherBody.mass;

            OtherBody.fX = OtherBody.fX + temp*mag*OtherBody.mass;
            OtherBody.fY = OtherBody.fY + temp2*mag*OtherBody.mass;
        }

        addVelocity(dT){
            this.vX = this.vX + this.fX * dT;
            //console.log(this.vX)
            this.vY = this.vY + this.fY * dT;
            //console.log(this.vY)
        }

        toString(){
            return this.x + " " + this.y + " " + this.vX + " " + this.vY;
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

        update(dT){
            
            for(let i=0; i<this.bodyList.length; i++){
                this.bodyList[i].update(dT);
                //console.log(this.bodyList[i]);
            }

            for(let i=0; i<this.bodyList.length; i++){
                this.bodyList[i].reset();
                for(let j=0; j<this.bodyList.length; j++){
                    if(j != i){
                        this.bodyList[i].addForce(this.bodyList[j]);
                    }
                }
            }

            for(let i=0; i<this.bodyList.length; i++){
                //console.log(this.bodyList[i]);
                this.bodyList[i].addVelocity(dT);
                //console.log(this.bodyList[i]);
            }

            for(let i=0; i<this.bodyList.length; i++){
                this.bodyList[i].update(dT);
                //console.log(this.bodyList[i]);
            }
        }

        start(){
            var central = new Body(0, 0, 0, 0, 0, 0, 20, 'Red');
            //var b = new Body(0, 0, 1, -1, 1, -1, BodyMass, 'Green');
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
                context.arc(ScreenHor(b.x), ScreenVer(b.y), (BodyRadius*PPM), 0, 2*Math.PI, true);
                context.fill();
                context.stroke();
            } else {
                context.fillStyle ='#f80';
                context.beginPath();
                context.arc(ScreenHor(b.x), ScreenVer(b.y), (CentralRadius*PPM), 0, 2*Math.PI, true);
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
    
    function OnMouseDown(evt) {
        const canvas = document.getElementById('SimCanvas');
        const hor = evt.pageX - canvas.offsetLeft;
        const ver = evt.pageY - canvas.offsetTop;
        const x = WorldX(hor);
        const y = WorldY(ver);
        var b = new Body(x, y, 0, 0, 0, 0, 10, 'Green');
        sim.addBody(b)
        console.log("sup");
    }
    
    window.onload = function() {
        sim = init();
        const canvas = document.getElementById('SimCanvas');
        canvas.addEventListener('mousedown', OnMouseDown);
        console.log("bruhg");
        //sim.start();
        AnimationFrame();
    }
})();