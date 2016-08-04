/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// var $ = require ('jquery');
	const canvas = document.getElementById('arkannoyed-canvas');
	const context = canvas.getContext('2d');
	const World = __webpack_require__(1);
	const Levels = __webpack_require__(5);

	var lifeCounter = document.getElementById('life-counter-js');
	var almond = new Image();
	var world = new World(canvas.width, canvas.height, 0);
	var currentLevelCounter = 0;
	var maxLevels = 12;
	gameInit();
	renderWorld();
	world.gameState = 0;

	function gameInit() {
	  world.translateLevel(Levels[currentLevelCounter]);
	  world.renderLevel(world.newLevel);
	  world.renderCourt(world.newLevel);
	}

	function drawCanvas() {
	  context.clearRect(0, 0, world.width, world.height);
	  context.fillStyle = '#00253b';
	  context.fillRect(0, 0, world.width, world.height);
	}

	function drawPaddle() {
	  context.fillStyle = '#919191';
	  context.fillRect(world.paddle.x, world.paddle.y, world.paddle.width, world.paddle.height);
	}

	function drawBall() {
	  almond.src = 'Game-Time/img/little-almond.PNG';
	  context.drawImage(almond, world.ball.x, world.ball.y, world.ball.height, world.ball.width);
	}

	function drawCurrentCourt() {
	  world.court.forEach(function (brick) {
	    if (brick.status === 1) {
	      context.fillStyle = '#a7b90f';
	    }
	    if (brick.status === 3) {
	      context.fillStyle = '#d9380c';
	    }
	    if (brick.status === 2) {
	      context.fillStyle = 'blanchedalmond';
	    }
	    if (brick.status < 0) {
	      context.fillStyle = '#919191';
	    }
	    context.fillRect(brick.x, brick.y, brick.width, brick.height);
	  });
	}

	function updateLives(text) {
	  lifeCounter.textContent = text;
	}

	function renderWorld() {
	  drawCanvas();
	  drawCurrentCourt();
	  drawPaddle();
	  drawBall();
	}

	function renderStartScreen(text) {
	  context.textAlign = 'center';
	  context.fillStyle = 'blanchedalmond';
	  context.font = '50px Arial';
	  context.fillText(text, canvas.width / 2, canvas.height * 0.66);
	}

	function countDown(number, delay) {
	  window.setTimeout(function () {
	    renderWorld();
	    context.fillStyle = 'blanchedalmond';
	    context.fillText('Get Ready...', canvas.width / 2, canvas.height * 0.66);
	    context.fillText(number, canvas.width / 2, canvas.height * 0.75);
	  }, delay);
	}

	function displayGameOver() {
	  context.fillStyle = 'blanchedalmond';
	  context.fillText('Game Over.', canvas.width / 2, canvas.height * 0.66);
	  document.getElementById("reset").disabled = false;
	}

	function displayGameWon() {
	  context.fillStyle = 'blanchedalmond';
	  context.fillText('Congratulations, you won!', canvas.width / 2, canvas.height * 0.66);
	  document.getElementById("reset").disabled = false;
	}

	function mouseMoveHandler(e) {
	  var relativeX = e.clientX;
	  if (relativeX - world.paddle.width >= 0 && relativeX <= canvas.width) {
	    world.paddle.x = relativeX - world.paddle.width;
	  }
	}

	function tick(world) {
	  world.tick();
	}

	function nextLevel() {
	  if (currentLevelCounter === maxLevels) {
	    displayGameWon();
	  } else {
	    world = new World(canvas.width, canvas.height, 0);currentLevelCounter++;
	    world.translateLevel(Levels[currentLevelCounter]);
	    world.renderLevel(world.newLevel);
	    world.renderCourt(world.newLevel);
	    renderWorld();
	    worldStart();
	  }
	}

	function prevLevel() {
	  world = new World(canvas.width, canvas.height, 0);currentLevelCounter--;
	  world.translateLevel(Levels[currentLevelCounter]);
	  world.renderLevel(world.newLevel);
	  world.renderCourt(world.newLevel);
	  renderWorld();
	  worldStart();
	}

	function worldStart() {
	  updateLives(world.lives);
	  renderStartScreen('Get Ready...');
	  countDown('3', 0);
	  countDown('2', 1000);
	  countDown('1', 2000);
	  window.setTimeout(function () {
	    world.gameState = 1;
	    enterLoop();
	  }, 3000);
	}

	function enterLoop() {
	  requestAnimationFrame(function gameLoop() {
	    if (world.gameState === 1) {
	      renderWorld();
	      tick(world);
	      requestAnimationFrame(gameLoop);
	    } else if (world.gameState === 2) {
	      world.gameState = 0;
	      worldStart();
	    } else if (world.gameState === 3) {
	      world.gameState = 0;
	      drawCanvas();
	      nextLevel();
	    } else if (world.gameState === 4) {
	      world.gameState = 0;
	      drawCanvas();
	      prevLevel();
	    } else if (world.gameState === 5) {
	      updateLives('0');
	      displayGameOver();
	    } else {
	      requestAnimationFrame(gameLoop);
	    }
	  });
	}

	function resetPage() {
	  document.location.reload(true);
	}

	renderWorld();

	document.addEventListener('keydown', function (event) {
	  if (event.keyCode === 39) {
	    world.rightArrow();
	  }
	  if (event.keyCode === 37) {
	    world.leftArrow();
	  }
	});

	document.addEventListener("mousemove", mouseMoveHandler, false);

	document.getElementById("start").addEventListener("click", function () {
	  worldStart();
	  this.disabled = true;
	});

	document.getElementById("level-up").addEventListener("click", function () {
	  if (currentLevelCounter < maxLevels) {
	    if (world.gameState === 0) {
	      world = new World(canvas.width, canvas.height, 0);
	      currentLevelCounter++;
	      world.translateLevel(Levels[currentLevelCounter]);
	      world.renderLevel(world.newLevel);
	      world.renderCourt(world.newLevel);
	      renderWorld();
	    }
	    if (world.gameState === 1) {
	      world.gameState = 3;
	    }
	  }
	});

	document.getElementById("level-down").addEventListener("click", function () {
	  if (currentLevelCounter > 0) {
	    if (world.gameState === 0) {
	      world = new World(canvas.width, canvas.height, 0);
	      currentLevelCounter--;
	      world.translateLevel(Levels[currentLevelCounter]);
	      world.renderLevel(world.newLevel);
	      world.renderCourt(world.newLevel);
	      renderWorld();
	    }
	    if (world.gameState === 1) {
	      world.gameState = 4;
	    }
	  }
	});

	document.getElementById("reset").addEventListener("click", resetPage);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Ball = __webpack_require__(2);
	const Paddle = __webpack_require__(3);
	const Brick = __webpack_require__(4);

	function World(width, height, gameState) {
	  this.width = width;
	  this.height = height;
	  this.court = [];
	  this.newLevel = [];
	  this.paddle = new Paddle();
	  this.ball = new Ball();
	  this.gameState = gameState;
	  this.lives = 3;
	}

	World.prototype.addLevel = function (level) {
	  level.world = this;
	  this.levels.push(level);
	};

	World.prototype.addBrick = function () {
	  this.bricks.push(new Brick({}));
	};

	World.prototype.ballStart = function () {
	  this.ball.x += this.ball.directionX;
	  this.ball.y += this.ball.directionY;
	};

	World.prototype.respawn = function () {
	  this.ball = new Ball({});
	  this.paddle = new Paddle();
	  this.gameState = 2;
	};

	World.prototype.isBallHittingAWall = function (ball) {
	  if (ball.y <= 0) {
	    ball.invertY();
	  }
	  if (ball.x <= 0) {
	    ball.invertX();
	  }
	  if (ball.x + ball.width >= this.width) {
	    ball.invertX();
	  }
	};

	World.prototype.isBallHittingTheGround = function (ball) {
	  if (ball.y + ball.height >= this.height) {
	    this.lives--;
	    if (this.lives >= 1) {
	      this.respawn();
	    } else {
	      this.gameState = 5;
	    }
	  }
	};

	World.prototype.rightArrow = function () {
	  if (this.paddle.x + this.paddle.width < this.width) {
	    this.paddle.moveRight();
	  }
	};

	World.prototype.leftArrow = function () {
	  if (this.paddle.x > 0) {
	    this.paddle.moveLeft();
	  }
	};

	World.prototype.startBall = function () {
	  this.ball.speed = 4;
	};

	World.prototype.isBallColliding = function (object) {
	  return this.ball.isCollidingWith(object);
	};

	World.prototype.isBallCollidingWithPaddle = function (paddle) {
	  var ball = this.ball;
	  if (ball.isCollidingWith(paddle)) {
	    ball.y = paddle.y - ball.height;
	    if (ball.x + ball.width > paddle.x && ball.x + ball.width < paddle.x + 20) {
	      ball.left45();
	    }
	    if (ball.x + ball.width > paddle.x + 20 && ball.x + ball.width < paddle.x + 40) {
	      ball.left60();
	    }
	    if (ball.x >= paddle.x + 40 && ball.x + ball.width <= paddle.x + 60) {
	      ball.invertY();
	    }
	    if (ball.x > paddle.x + 60 && ball.x + ball.width < paddle.x + 80) {
	      ball.right60();
	    }
	    if (ball.x > paddle.x + 80 && ball.x + ball.width < paddle.x + paddle.width) {
	      ball.right45();
	    }
	  }
	};

	World.prototype.renderCourt = function (arr) {
	  arr = arr.filter(function (i) {
	    return i.status !== 0;
	  });
	  this.court = arr;
	};

	World.prototype.isBallCollidingWithBrick = function (level) {
	  for (var i = 0; i < level.length; i++) {
	    if (this.isBallColliding(level[i])) {
	      this.ball.bounce(level[i]);
	      level[i].status--;
	      this.renderCourt(level);
	    }
	  }
	};

	World.prototype.isCourtClear = function (level) {
	  var counter = 0;
	  for (var i = 0; i < level.length; i++) {
	    if (level[i].status > 0) {
	      counter++;
	    }
	  }

	  if (counter === 0) {
	    this.gameState = 3;
	  }
	};

	World.prototype.tick = function () {
	  this.isBallHittingAWall(this.ball);
	  this.isBallCollidingWithPaddle(this.paddle);
	  this.isBallCollidingWithBrick(this.court);
	  this.isCourtClear(this.court);
	  this.isBallHittingTheGround(this.ball);
	  this.ballStart();
	};

	World.prototype.translateLevel = function (level) {
	  var levelString = level.join('');
	  for (var i = 0; i < levelString.length; i++) {
	    if (levelString.charAt(i) === '#') {
	      this.newLevel.push(new Brick({ status: 1 }));
	    }
	    if (levelString.charAt(i) === 'O') {
	      this.newLevel.push(new Brick({ status: 0 }));
	    }
	    if (levelString.charAt(i) === 'U') {
	      this.newLevel.push(new Brick({ status: -1 }));
	    }
	    if (levelString.charAt(i) === 'M') {
	      this.newLevel.push(new Brick({ status: 3 }));
	    }
	  }
	  return this.newLevel;
	};

	World.prototype.renderLevel = function (level) {
	  this.court = [];
	  var columnCount = 12;
	  var rowCount = 8;
	  var i = 0;
	  for (var rows = 0; rows < rowCount; rows++) {
	    for (var columns = 0; columns < columnCount; columns++) {
	      level[i].x = 5 + columns * 62;
	      level[i].y = rows * 27;
	      this.court.push(level[i]);
	      i++;
	    }
	  }
	};

	module.exports = World;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Paddle = __webpack_require__(3);

	var paddle = new Paddle();

	function Ball(options) {
	  options = options || {};
	  this.height = 12;
	  this.width = 12;
	  this.x = options.x || 375;
	  this.y = options.y || 458;
	  this.speed = options.speed || 4;
	  this.world = options.world;
	  this.paddle = new Paddle();
	  this.directionX = this.speed;
	  this.directionY = -this.speed;
	  this.defaultSpeed = this.speed;
	}

	Ball.prototype.invertX = function () {
	  this.directionX = -this.directionX;
	};

	Ball.prototype.invertY = function () {
	  this.directionY = -this.directionY;
	};

	Ball.prototype.invert = function () {
	  this.directionY = -this.directionY;
	  this.directionX = -this.directionX;
	};

	Ball.prototype.left45 = function () {
	  this.directionY = -this.directionY;
	  this.directionX = -this.defaultSpeed;
	};

	Ball.prototype.left60 = function () {
	  this.directionY = -this.defaultSpeed;
	  this.directionX = -this.defaultSpeed * 0.6;
	};

	Ball.prototype.right45 = function () {
	  this.directionY = -this.directionY;
	  this.directionX = this.defaultSpeed;
	};

	Ball.prototype.right60 = function () {
	  this.directionY = -this.directionY;
	  this.directionX = this.defaultSpeed * 0.6;
	};

	Ball.prototype.isCollidingWith = function (thing) {
	  return this.x < thing.x + thing.width && this.x + this.width > thing.x && this.y < thing.y + thing.height && this.height + this.y > thing.y;
	};

	Ball.prototype.bounce = function (thing) {
	  var ballBottom = this.y + this.height;
	  var ballTop = this.y;
	  var ballLeft = this.x - 4;
	  var ballRight = this.x + this.width + 4;
	  var thingBottom = thing.y + thing.height;
	  var thingTop = thing.y;
	  var thingLeft = thing.x;
	  var thingRight = thing.x + thing.width;

	  if (ballRight > thingLeft && ballLeft < thingRight && ballTop >= thingBottom - 4) {
	    this.invertY();
	  } else if (ballRight > thingLeft && ballLeft < thingRight && ballBottom <= thingTop + 4) {
	    this.invertY();
	  } else {
	    this.invertX();
	  }
	};

	module.exports = Ball;

/***/ },
/* 3 */
/***/ function(module, exports) {

	
	function Paddle(options) {
	  options = options || {};
	  this.width = options.width || 100;
	  this.height = options.height || 10;
	  this.x = typeof options.x === 'undefined' ? 325 : options.x;
	  this.y = options.y || 470;
	  this.world = options.world;
	  this.speed = 40;
	}

	Paddle.prototype.moveLeft = function () {
	  this.x -= this.speed;
	};

	Paddle.prototype.moveRight = function () {
	  this.x += this.speed;
	};

	module.exports = Paddle;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Brick(options) {
	  this.x = options.x || 0;
	  this.y = options.y || 100;
	  this.height = options.height || 25;
	  this.width = options.width || 60;
	  this.status = options.status;
	}

	module.exports = Brick;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var Levels = [['OOOOOOOOOOOO', '############', '############', 'OOOOOOOOOOOO', '############', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO'], ['############', 'OOOOOOOOOOOO', '#M#M#M#M#M#M', 'OOOOOOOOOOOO', 'M#M#M#M#M#M#', 'OOOOOOOOOOOO', '############', 'OOOOOOOOOOOO'], ['###M####M###', '##M######M##', '#M########M#', 'M##########M', '#M########M#', '##M######M##', '###M####M###', 'OOOOOOOOOOOO'], ['############', '#####OO#####', '#####OO#####', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', '#####OO#####', '#####OO#####', '############'], ['############', 'O##########O', 'OO########OO', 'OMO######OMO', 'OOOO####OOOO', 'OMOOO##OOOMO', 'OOOOOOOOOOOO', 'OOOMOOOOMOOO'], ['OOOOMOOMOOOO', 'OOO######MOO', 'OO#O#OO#OOOO', 'OOO######OOO', 'OOOO#OO#O#OO', 'OOOO#OO#O#OO', 'OOM######OOO', 'OOOOMOOMOOOO'], ['#M##OOOO##M#', '####OOOO####', '#M##OOOO##M#', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', '#M##OOOO##M#', '####OOOO####', '#M##OOOO##M#'], ['OOO###OOO###', '###OOO###OOO', 'OOO###OOO###', '###OOO###OOO', 'OOO###OOO###', '###OOO###OOO', 'OOO###OOO###', '###OOO###OOO'], ['####OOOOOOOO', '#####OOOOOOM', '######OOOOOO', '#######OOOOM', '########OOOO', '#########OOM', '##########OO', '#M#M#M#M#M##'], ['OOOOM##MOOOO', 'OMOOO##OOOMO', 'OOOOM##MOOOO', 'OMOOO##OOOMO', 'OOOOM##MOOOO', 'OMOOO##OOOMO', 'OOOOM##MOOOO', 'OMOOO##OOOMO'], ['MOMOMOMOMOMO', 'OMOMOMOMOMOM', 'MOMOMOMOMOMO', 'OMOMOMOMOMOM', 'MOMOMOMOMOMO', 'OMOMOMOMOMOM', 'MOMOMOMOMOMO', 'OMOMOMOMOMOM'], ['OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOO#O'], ['OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOOOO', 'OOOOOOOOOO#O']];

	module.exports = Levels;

/***/ }
/******/ ]);
