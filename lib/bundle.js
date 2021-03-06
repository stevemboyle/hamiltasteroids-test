/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  // canvasEl.width = Game.DIM_X;
	  // canvasEl.height = Game.DIM_Y;tar
	
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Foe = __webpack_require__(2);
	var Bullet = __webpack_require__(6);
	var Ship = __webpack_require__(5);
	
	var Game = function () {
	  this.foes = [];
	  this.bullets = [];
	  this.ships = [];
	
	  this.addFoes();
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_FOES = 7;
	
	Game.prototype.add = function (object) {
	  if (object.type === "Foe") {
	    this.foes.push(object);
	  } else if (object.type === "Bullet") {
	    this.bullets.push(object);
	  } else if (object.type === "Ship") {
	    this.ships.push(object);
	  } else {
	    throw "wtf?";
	  }
	};
	
	Game.prototype.addFoes = function () {
	  for (var i = 0; i < Game.NUM_FOES; i++) {
	    this.add(new Foe({ game: this }));
	  }
	};
	
	Game.prototype.addShip = function () {
	  var ship = new Ship({
	    // pos: this.randomPosition(),
	    pos: [500, 300],
	    game: this
	  });
	
	  this.add(ship);
	  //
	  var welcome = new Audio('app/assets/music/welcome.mp3');
	  welcome.play();
	
	  return ship;
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.ships, this.foes, this.bullets);
	};
	
	Game.prototype.checkCollisions = function () {
	  var game = this;
	
	  this.allObjects().forEach(function (obj1) {
	    game.allObjects().forEach(function (obj2) {
	      if (obj1 == obj2) {
	        // don't allow self-collision
	        return;
	      }
	
	      if (obj1.isCollidedWith(obj2)) {
	        // alert("collllllllision");
	        if (obj1.type === "Ship" && obj2.type === "Foe"){
	
	
	        } else if (obj1.type === "Foe" && obj2.type === "Bullet"){
	
	
	          // alert("Got him!");
	          // var spark = new Audio('app/assets/music/spark.mp3');
	          // spark.play();
	          if (game.foes.length === 1){
	            // alert("You win!");
	            var wewon = new Audio('app/assets/music/wewon.mp3');
	            wewon.play();
	          } else {
	            var deadlyaim = new Audio('app/assets/music/deadlyaim.mp3');
	            deadlyaim.play();
	          }
	        }
	        obj1.collideWith(obj2);
	      }
	    });
	  });
	};
	
	Game.prototype.draw = function (ctx) {
	
	  var backgroundImage = new Image();
	  backgroundImage.src = "http://65.media.tumblr.com/e03203fc03fce5f5166c6cc7a1c4212c/tumblr_nvlja3oXTM1un1x6fo1_1280.jpg";
	
	  var pat = ctx.createPattern(backgroundImage, "repeat");
	
	
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = pat;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	
	};
	
	// TODO: Change Out of Bounds to create bounces
	
	Game.prototype.isOutOfBounds = function (pos) {
	  return (pos[0] < 0) || (pos[1] < 0) ||
	    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
	};
	
	Game.prototype.moveObjects = function (delta) {
	  this.allObjects().forEach(function (object) {
	    object.move(delta);
	  });
	};
	
	Game.prototype.randomPosition = function () {
	  return [
	    Game.DIM_X,
	    Game.DIM_Y
	    // Game.DIM_X * Math.random(),
	    // Game.DIM_Y * Math.random()
	  ];
	};
	
	Game.prototype.remove = function (object) {
	  if (object instanceof Bullet) {
	    this.bullets.splice(this.bullets.indexOf(object), 1);
	  } else if (object instanceof Foe) {
	    this.foes.splice(this.foes.indexOf(object), 1);
	    // var idx = this.foes.indexOf(object);
	    // this.foes[idx] = new Foe({ game: this });
	  } else if (object instanceof Ship) {
	    this.ships.splice(this.ships.indexOf(object), 1);
	  } else {
	    throw "wtf?";
	  }
	};
	
	Game.prototype.step = function (delta) {
	  this.moveObjects(delta);
	  this.checkCollisions();
	};
	
	Game.prototype.wrap = function (pos) {
	  return [
	    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
	  ];
	
	  function wrap(coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(5);
	
	var DEFAULTS = {
		COLOR: "#505050",
		RADIUS: 50,
		SPEED: 1
	};
	
	
	
	var Foe = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
		options.radius = 50;
	  // options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	
	  MovingObject.call(this, options);
	};
	
	
	Foe.prototype.draw = function (ctx) {
	
	  var jeffersonImage = new Image();
	
	
	
	  jeffersonImage.src = "app/assets/images/jefferson";
	
		// jeffersonImage.src = "http://static.tumblr.com/6f56f6f9ac1c0e1b5c8645b113c68cf7/6hyorli/yV1o3y4eh/tumblr_static_90vcmda556gwc84k8488s8ssg.png";
	
		ctx.drawImage(jeffersonImage, this.pos[0], this.pos[1], 100, 100);
	
	  // jeffersonImage.onload = function() {
	  //
	  //         ctx.drawImage(jeffersonImage, 0, 0);
	  //
	  //       };
	
	  // var pat = ctx.createPattern(jeffersonImage, "repeat");
		//
	  // ctx.fillStyle = pat;
		//
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  // );
	  // ctx.fill();
	};
	
	
	
	Foe.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Ship") {
	    // otherObject.relocate();
	
			// otherObject.remove();
			this.remove();
	  }
	};
	
	Util.inherits(Foe, MovingObject);
	
	Foe.prototype.type = "Foe";
	
	module.exports = Foe;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  ; // default do nothing
	};
	//
	MovingObject.prototype.draw = function (ctx) {
	
	  var jeffersonImage = new Image();
	  jeffersonImage.src = "app/assets/images/daveed.png";
	
	  // jeffersonImage.src = "http://static.tumblr.com/6f56f6f9ac1c0e1b5c8645b113c68cf7/6hyorli/yV1o3y4eh/tumblr_static_90vcmda556gwc84k8488s8ssg.png";
	
		ctx.drawImage(jeffersonImage, this.pos[0], this.pos[1], 100, 100);
	
	  // var greenImage = new Image();
	  // greenImage.src = "http://juliannehough.com/wp-content/uploads/2016/02/jules-green-eyes.jpg";
	  //
	  // // greenImage.onload = function() {
	  // //
	  // //         ctx.drawImage(greenImage, 0, 0);
	  // //
	  // //       };
	  //
	  // var pat = ctx.createPattern(greenImage, "repeat");
	  //
	  // ctx.fillStyle = pat;
	  //
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  // );
	  // ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	MovingObject.prototype.isWrappable = true;
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(5);
	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var Bullet = __webpack_require__(6);
	
	function randomColor() {
	  var hexDigits = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	var Ship = function (options) {
	  options.radius = Ship.RADIUS;
	  options.vel = options.vel || [0, 0];
	  options.color = options.color || randomColor();
	
	  MovingObject.call(this, options);
	};
	
	Ship.prototype.type = "Ship";
	
	Ship.RADIUS = 50;
	
	Util.inherits(Ship, MovingObject);
	
	
	Ship.prototype.draw = function (ctx) {
	
	  var hamiltonImage = new Image();
	
	
	
	hamiltonImage.src = "http://40.media.tumblr.com/d4fc63fc73bdf4ee89899177b453b7d0/tumblr_nttbh4CiwE1qas9euo1_250.png";
	
	  // hamiltonImage.src = "http://65.media.tumblr.com/52b7727a6930921a46f17f3d9e2ea3cb/tumblr_nzb5vc82j01rxkqbso1_500.png";
	
	  // hamiltonImage.src = "https://67.media.tumblr.com/avatar_dc85f52b3bfd_128.png";
	
	  ctx.drawImage(hamiltonImage, this.pos[0], this.pos[1], 150, 150);
	
	  //
	  // var ship = this;
	  //
	  // var hamiltonImage = new Image();
	  //
	  //   hamiltonImage.src = "https://67.media.tumblr.com/avatar_dc85f52b3bfd_128.png";
	  // // hamiltonImage.src = "http://graphics8.nytimes.com/images/2015/08/18/arts/18artsbeat-grosses/18artsbeat-grosses-tmagArticle.jpg";
	  //
	  // hamiltonImage.onload = function() {
	  //
	  //     ctx.drawImage(hamiltonImage, ship.pos[0], ship.pos[1], ship.radius, ship.radius);
	  //
	  //       };
	  //
	  // // var pat = ctx.createPattern(hamiltonImage, "repeat");
	  //
	  // // ctx.fillStyle = pat;
	  //
	  //
	  //
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  // );
	  //
	  // // ctx.fill();
	};
	
	
	Ship.prototype.fireBullet = function () {
	  var norm = Util.norm(this.vel);
	
	  if (norm == 0) {
	    // Can't fire unless moving.
	    return;
	  }
	
	  var relVel = Util.scale(
	    Util.dir(this.vel),
	    Bullet.SPEED
	  );
	
	  var bulletVel = [
	    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  ];
	
	  var bullet = new Bullet({
	    pos: this.pos,
	    vel: bulletVel,
	    color: this.color,
	    game: this.game
	  });
	
	  this.game.add(bullet);
	  var gunshot = new Audio('app/assets/music/gunshot.mp3');
	  gunshot.play();
	
	};
	
	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	
	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	
	
	Ship.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Foe") {
	    this.remove();
	    var killmusic = new Audio('app/assets/music/killmusic.mp3');
	    killmusic.play();
	
	    // window.location = 'youlose.html';
	    // alert("Lose!");
	    // otherObject.remove();
	  }
	};
	
	Ship.prototype.type = "Ship";
	
	module.exports = Ship;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Foe = __webpack_require__(2);
	
	var Bullet = function (options) {
	  options.radius = Bullet.RADIUS;
	
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 50;
	Bullet.SPEED = 15;
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Foe") {
	    this.remove();
	    otherObject.remove();
	  }
	};
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	
	Bullet.prototype.draw = function (ctx) {
	
	  var bulletImage = new Image();
	
	  // bulletImage.src = "http://www.mofirst.org/images/constitution-scroll.gif";
	
	
	
	  http://a1.mzstatic.com/us/r30/Publication6/v4/27/8c/20/278c20a1-e0c2-20bc-9c5e-22374a80b3f4/cover92x115.jpeg
	
	  bulletImage.src = "http://gunsofold.com/images/fd1084l.gif";
	
	  ctx.drawImage(bulletImage, this.pos[0], this.pos[1], 50, 50);
	
	  //
	  // var jeffersonImage = new Image();
	  // jeffersonImage.src = "http://www.thenation.com/wp-content/uploads/2015/08/solomon_hamilton_otu.jpg";
	  //
	  // // jeffersonImage.onload = function() {
	  // //
	  // //         ctx.drawImage(jeffersonImage, 0, 0);
	  // //
	  // //       };
	  //
	  // var pat = ctx.createPattern(jeffersonImage, "repeat");
	  //
	  // ctx.fillStyle = pat;
	  //
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  // );
	  // ctx.fill();
	};
	
	
	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	};
	
	GameView.MOVES = {
	  "up": [ 0, -1],
	  "left": [-1,  0],
	  "down": [ 0,  1],
	  "right": [ 1,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var ship = this.ship;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    var move = GameView.MOVES[k];
	    key(k, function () { ship.power(move); });
	  });
	
	  key("space", function () { ship.fireBullet() });
	};
	
	GameView.prototype.start = function () {
	  // alert("Hello!");
	
	
	
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  alert("Welcome to Hamilton Arcade! Today, you will be fighting your ideological enemy, Thomas Jefferson. Use the arrow keys to move and the spacebar to shoot. Avoid the Jeffersons and eliminate them all!");
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map