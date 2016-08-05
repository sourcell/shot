/*
==============================
		VARIABLES
==============================
*/

var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");

var key = [];
var SPACEBAR = 32;
var W = 87;
var A = 65;
var S = 83;
var D = 68;

var Game = {
	FPS: 60,

	clear: function(){
		ctx.clearRect(0, 0, map.width, map.height);
	}
}

var map = {
	x: 0,
	y: 0,
	width: window.innerWidth,
	height: window.innerHeight
}

var player = {
	x: 20,
	y: map.height - 30,
	size: 15,
	speed: 5,
	shotted: false,
	points: 0,

	ammo: {
		x: 20,
		y: map.height - 30,
		size: 10,
		speed: 20,

		draw: function(){
			ctx.fillStyle = Color.blue;
			ctx.strokeStyle = Color.blue;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
			ctx.fill();
			ctx.stroke();
		},

		reset: function(){
			player.shotted = false;
			this.x = player.x;
			this.y = player.y;
		}
	},

	draw: function(){
		ctx.fillStyle =  Color.blue;
		ctx.strokeStyle = Color.blue;
		ctx.beginPath();
		ctx.arc(player.x, player.y, player.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	moveLeft: function(){
		this.x -= this.speed;

		if(this.ammo.y == this.y){
			this.ammo.x = this.x;
		}
	},

	moveRight: function(){
		this.x += this.speed;

		if(this.ammo.y == this.y){
			this.ammo.x = this.x;
		}
	},

	autoMove: function(){
		this.x += this.speed;

		if(player.x < map.x || player.x + player.size > map.width){
			this.speed = -this.speed;
		}

		if(this.ammo.y == this.y){
			this.ammo.x = this.x;
		}
	},

	shot: function(){
		if(this.shotted == false){return}

		if(this.ammo.y > -this.ammo.size){
			this.ammo.y -= this.ammo.speed;
		}else{
			this.ammo.reset();
		}
	},

	pointer: function(){
		ctx.strokeStyle = Color.blue;
		ctx.beginPath();
		ctx.moveTo(this.x - 15, this.y);
		ctx.lineTo(this.x, this.y - this.size - 20);
		ctx.lineTo(this.x + 15, this.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	},

	drawPoints: function(){
		ctx.fillStyle = "white";
		ctx.font = "20px Trebuchet MS"
		ctx.fillText("Points: " + this.points, 50, 50);
	}
}

var food = {
	x: random(5, map.width - 10),
	y: random(5, player.y - 100),
	size: 20,

	draw: function(){
		ctx.fillStyle = Color.green;
		ctx.strokeStyle = Color.green;
		ctx.beginPath();
		ctx.arc(food.x, food.y, food.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

var Color = {
	red: "#E74C3C",
	green: "#2ECC71",
	blue: "#3498DB",
	purple: "#9B59B6",
	pink: "#F0F"
}

var trap01 = {
	x: random(20, map.width - 20),
	y: random(20, player.y - 100),
	speed: 5,
	color: Color.red,
	size: 20,

	draw: function(){
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	bounce: function(){
		this.x += this.speed;
		if(this.x + this.size >= map.width || this.x < this.size){
			this.speed = -this.speed;
		}
	}
}

var trap02 = {
	x: random(20, map.width - 20),
	y: random(20, player.y - 100),
	speed: 5,
	color: Color.purple,
	size: 20,

	draw: function(){
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	bounce: function(){
		this.x += this.speed;
		if(this.x + this.size >= map.width || this.x < this.size){
			this.speed = -this.speed;
		}
	}
}

var trap03 = {
	x: random(20, map.width - 20),
	y: random(20, player.y - 100),
	speed: 5,
	color: Color.pink,
	size: 20,

	draw: function(){
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	bounce: function(){
		this.x += this.speed;
		if(this.x + this.size >= map.width || this.x < this.size){
			this.speed = -this.speed;
		}
	}
}




/*
==============================
		EVENTS
==============================
*/

window.addEventListener("keydown", function(e){
	key[e.keyCode] = true;
});

window.addEventListener("keyup", function(e){
	delete key[e.keyCode];
});

window.addEventListener("mousedown", function(){
	player.shotted = true;
});

window.onresize = canvasSetup;




/*
==============================
		FUNCTIONS
==============================
*/

canvasSetup();
phoneOptimize();

function canvasSetup(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function phoneOptimize(){
	if(window.innerHeight < 1000){
		player.size = 30;
		playeer.ammo.size = 20;
		food.size = 40;
		trap01.size = 40;
		trap02.size = 40;
		trap03.size = 40;
	}
}

function random(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function getDist(a, b){
	return Math.sqrt(Math.abs(a.x-b.x) * Math.abs(a.x-b.x) + Math.abs(a.y-b.y) * Math.abs(a.y-b.y));
}

function isHit(a, b){
	if(getDist(a, b) <= a.size + b.size){
		return true;
	}else{
		return false;
	}
}




/*
==============================
		INTERVAL
==============================
*/

setInterval(function(){
	Game.clear();
	food.draw();
	trap01.draw();
	trap01.bounce();
	trap02.draw();
	trap02.bounce();
	trap03.draw();
	trap03.bounce();
	player.ammo.draw();
	player.pointer();
	player.draw();
	player.drawPoints();
	player.shot();
	player.autoMove();

	if(isHit(player.ammo, food)){
		player.points++;
		food.x = random(food.size, map.width - food.size);
		food.y = random(food.size, player.y - 100);
		player.ammo.reset();
	}

	// 'A' key pressed
	if(key[A] && player.x > player.size){
		player.moveLeft();
	}


	// 'D' key pressed
	if(key[D] && player.x + player.size < map.width){
		player.moveRight();
	}

	// 'Spacebar' pressed
	if(key[SPACEBAR] || key[W]){
		player.shotted = true;
	}
}, 1000/Game.FPS);