/*
==============================
		CANVAS SETUP
==============================
*/
var map = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvasSetup();



/*
==============================
	OBJECTS & VARIABLES
==============================
*/
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
	},

	restart: function(){
		generateBlocks();
		player.counter = 0;
		player.score = 0;
		player.ammo.reset();
		player.colorChange();
	},

	reset: function(){
		generateBlocks();
		player.counter = 0;
		player.ammo.reset();
		player.colorChange();	
	}
}

var Color = {
	red: "#E74C3C",
	green: "#2ECC71",
	blue: "#3498DB",
	purple: "#9B59B6",
	pink: "#F0A",
	yellow: "#F1C40F",
	orange: "#E67E22",
	wet: "#34495E"
}

var blocks = [];
generateBlocks();

var player = {
	x: 20,
	y: map.height - 30,
	size: 15,
	speed: 5,
	shotted: false,
	score: 0,
	counter: 0,
	highScore: 0,
	color: Color.blue,
	isDead: false,

	ammo: {
		x: 20,
		y: map.height - 30,
		size: 10,
		speed: 10,
		color: Color.blue,

		draw: function(){
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
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
		ctx.fillStyle =  this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(player.x, player.y, player.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	colorChange: function(){
		var randomColor = random(0, 7);

		if(blocks[randomColor].isDead){
			this.colorChange();
		}else{
			this.color = this.ammo.color = blocks[randomColor].color;
		}
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

		if(player.x - player.size < map.x || player.x + player.size > map.width){
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
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x - 15, this.y);
		ctx.lineTo(this.x, this.y - this.size - 20);
		ctx.lineTo(this.x + 15, this.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	},

	drawScore: function(){
		ctx.fillStyle = "white";
		ctx.font = "20px Trebuchet MS"
		ctx.fillText("Score: " + this.score, 50, 50);
	},

	drawHighScore: function(){
		ctx.fillStyle = "white";
		ctx.font = "20px Trebuchet MS"
		ctx.fillText("High Score: " + this.highScore, map.width - 175, 50);
	}
}
player.colorChange();

var msgbox = {
	x: map.width/2 - 200,
	y: map.height/2,
	width: 400,
	height: 200,
	color: "white",

	draw: function(){
		ctx.fillStyle = this.color;
		ctx.font = "60px Trebuchet MS";
		ctx.fillText("You have died!", this.x, this.y);
	}
}




/*
==============================
		EVENTS
==============================
*/
window.onkeydown = function(e){
	key[e.keyCode] = true;
}

window.onkeyup = function(e){
	delete key[e.keyCode];
}

window.onmousedown = function(e){
	player.isDead = false;
}

window.onresize = canvasSetup;




/*
==============================
		FUNCTIONS
==============================
*/
phoneOptimize();

function canvasSetup(){
	map.width = window.innerWidth-6;
	map.height = window.innerHeight-6;
}

function phoneOptimize(){
	if(window.innerWidth < 1000){
		player.size = 30;
		player.ammo.size = 20;
	}
}

function random(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function Block(x, y, width, height, speed, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	
	if(color == 0){
		this.color = Color.blue;
	}else if(color == 1){
		this.color = Color.pink;
	}else if(color == 2){
		this.color = Color.purple;
	}else if(color == 3){
		this.color = Color.yellow;
	}else if(color == 4){
		this.color = Color.green;
	}else if(color == 5){
		this.color = Color.red;
	}else if(color == 6){
		this.color = Color.orange;
	}else if(color == 7){
		this.color = Color.wet;
	}

	this.isDead = false;

	this.draw = function(){
		if(player.isDead){return;}

		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);	
	};

	this.move = function(){
		if(player.isDead){return;}

		this.x += this.speed;

		if(this.x <= 0 || this.x + this.width >= map.width){
			this.speed = -this.speed;
		}
	};

	this.getShot = function(){
		if(player.ammo.x >= this.x && player.ammo.x <= this.x + this.width && player.ammo.y - player.ammo.size <= this.y + this.height && player.ammo.y - player.ammo.size >= this.y){
			return true;
		}else{
			return false;
		}
	}
}

function generateBlocks(){
	for(var i = 0; i < 8; i++){
		blocks[i] = new Block(random(0, map.width-map.width/3), random(0, map.height-200), random(50, map.width/3), random(10, 50), random(1, 6), random(0, 3));
	}
}




/*
==============================
		INTERVAL
==============================
*/
setInterval(function(){
	Game.clear();
	
	player.ammo.draw();
	player.pointer();
	player.draw();
	player.shot();
	//player.autoMove();

	if(player.counter == 8){
		Game.reset();
	}
	
	// 'A' key pressed
	if(key[A] && player.x > player.size){
		player.moveLeft();
	}

	// 'D' key pressed
	if(key[D] && player.x + player.size < map.width){
		player.moveRight();
	}

	// 'Spacebar' or 'W' pressed
	if(key[SPACEBAR] && !player.isDead || key[W] && !player.isDead){
		player.shotted = true;
	}

	for(var i = 0; i < blocks.length; i++){
		if(blocks[i].getShot() && !blocks[i].isDead){
			if(blocks[i].color == player.ammo.color){
				blocks[i].isDead = true;
				player.counter++;
				player.score++;
				player.ammo.reset();
				player.colorChange();
			}else{
				if(player.score > player.highScore){
					player.highScore = player.score;
				}

				player.isDead = true;

				Game.restart();			
			}
		}

		if(!blocks[i].isDead){
			blocks[i].draw();
			blocks[i].move();
		}
	}

	player.drawScore();
	player.drawHighScore();

	if(player.isDead){
		msgbox.draw();
	}
}, 1000/Game.FPS);