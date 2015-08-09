var sphero = require("sphero"),
	    orb = sphero("/dev/tty.Sphero-ORG-AMP-SPP");
var Leap = require('leapjs');

var speed = 100;
var minAngle = 0.6;

var oldId = 0;
var oldTime = 0;
var hasStop = false;



var stop = function() {
	if(hasStop == false)
	{
		console.log("stop!");
		orb.roll(0, 0);
		orb.color("blue");
		hasStop = true;
	}
};

var forwardMove = function(s) {
	orb.color("green");
	console.log("forward");
	orb.roll(s, 0);
	hasStop = false;
};


var backwardMove = function(s) {
	orb.color("green");
	console.log("backward");
	orb.roll(s, 180);
	hasStop = false;
};

var leftMove = function(s) {
	orb.color("green");
	console.log("left");
	orb.roll(s, 270);
	hasStop = false;
};

var rightMove = function(s) {
	orb.color("green");
	console.log("right");
	orb.roll(s, 90);
	hasStop = false;
};

var GestIdChagned = function(id) {
	var rtn = false;
	var nowTime = new Date().getTime();
	var dur = nowTime - oldTime;
	if(oldId != id && dur > 1000)
	{
		oldTime = nowTime;
		rtn = true;
	}

	oldId = id;

	return rtn;
};


var swipeGestDir = function(gesture) {
	var isHor = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
	if(isHor) {
		if(gesture.direction[0] > 0)
		{
			return "right";
		}
		else
		{
			return "left";
		}
	}
	else
	{
		if(gesture.direction[1] > 0)
		{
			return "up";
		}
		else
		{
			return "down";
		}
	}
};


var move = function(frame) {
	if (GestIdChagned(frame.gestures[0].id)) {
		var ges = frame.gestures[0];
		var gesSpeed = frame.gestures[0].speed;
		var dir = swipeGestDir(ges);
		if (dir == "down" && gesSpeed > 0){
			forwardMove(speed);
			//TODO
		} else if (dir == "up" && gesSpeed > 0) {
			backwardMove(speed);
			//TODO
		} else if (dir == "left" && gesSpeed > 0){
			leftMove(speed);
			//TODO
		} else if (dir == "right" && gesSpeed > 0){
			rightMove(speed);
			//TODO
		} else {
			//stop();
		}
	}
};


var controlSphero = function() {
	var controller = new Leap.Controller({
        frameEventName: 'deviceFrame',
        enableGestures:true
    });

	controller.on('frame', function(frame) {
			if (frame.pointables.length === 1 && frame.gestures.length && frame.gestures[0].type == 'circle') {
			//setHeading(frame.gestures[0]);
			//TODO calibration
			} else if (frame.pointables.length > 3 && frame.gestures.length && frame.gestures[0].type == 'swipe') {
			//console.log(frame.pointables.length);
			move(frame);
			} else if (frame.pointables.length === 0){
			stop();
			}

/*			if(frame.pointables.length > 3 && frame.gestures.length)
			{
			switch (frame.gestures[0].type) {

			case "circle":
//			console.log("Circle Gesture");
			break;

			case "keyTap":
//			console.log("Key Tap Gesture");
			break;
			
			case "screenTap":
//			console.log("Screen Tap Gesture");
			break;
			
			case "swipe":
			console.log("Swipe Gesture");
			console.log(frame.gestures[0].id);
			console.log(frame.gestures[0].speed);
			console.log(swipeGestDir(frame.gestures[0]));
			break;
			}
			}
			*/
	});

	controller.connect();
};

/*orb.connect(function() {
		  // Sphero's connected!
		  // do some cool stuff here!
		console.log("sphero is connected!");
		orb.color("green");
		orb.roll(150, 0);
		});*/
orb.connect(function() {
		orb.color("red");
		console.log("start...");
		controlSphero();
});

//controlSphero();

