// ========== Anim Background Image du canvas ==========

(function() {
    function Game(canvas) {

    	// ========== Config ==========
        var background = {
            src: './images/background/resized-space-full-bg.jpg',
            motion: 300
        }
        var boky = {
            src: './images/sprite/boky-sprite.png',
            width: 185,
            height: 127,
            frame: 0,
            x: 0,
            y: 0,
            step: 15,
            attacking: {
                numberOfFrames: 16
            },
            direction: null
        }

        var cody = {
            src: './images/sprite/cody-sprite.png',
            width: 122,
            height: 96,
            frame: 0,
            x: 200,
            y: 200,
            flyingUp: true,
            step: 8,
            flying: {
                numberOfFrames: 4
            }
        }

        var villain = {
            src: './images/sprite/villain-sprite.png',
            width: 74,
            height: 80,
            frame: 0,
            x: 1000,
            y: 250,
            flying: {
                numberOfFrames : 2
            }
        }

        var gameTheme = {
            src: './music/Brave%20World.wav',

        }

        // ========== Width & Height du canvas ==========
        var context = canvas.getContext('2d');
        canvas.width = 1140;
        canvas.height = 570;

        // ========== Variables d'animation du canvas ====
        var looping = false;
        var totalSeconds = 0;
        var lastFrameTime = 0;

        // =========== Request Animation Frame ===========
        window.requestAnimationFrame = window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || function(callback) { window.setTimeout(callback, 1000 / 60); };


        function loadGame() {
            loadBackground();
            loadBoky();
            loadControls();
            loadCody();
            loadVillain();
            loadGameTheme();
        }

        function loadBackground () {
            background.image = new Image();
            background.image.onload = function() {
                loopBackground(0)
            };
            background.image.src = background.src;
        }

        function loadBoky() {
            boky.image = new Image();
            boky.image.onload = function() {
                loopBoky(0);
            };
            boky.image.src = boky.src;
        }

        function loadControls() {

            document.onkeydown = function(event) {
                switch(event.keyCode) {
                    case 38: // Up
                        boky.direction = 'up';
                        event.preventDefault();
                        break;
                    case 40: // Down
                        boky.direction = 'down';
                        event.preventDefault();
                        break;
                    case 37:
                        boky.direction = 'left';
                        event.preventDefault();
                        break;
                    case 39:
                        boky.direction = 'right';
                        event.preventDefault();
                        break;
                }
            }

            document.onkeyup = function() {
               boky.direction = null;
            }
        }

        function moveBoky() {

            if (boky.direction === 'up') {
                moveBokyUp();
            } else if (boky.direction === 'down') {
                moveBokyDown();
            } else if (boky.direction === 'left') {
                moveBokyLeft();
            } else if (boky.direction === 'right') {
                moveBokyRight();
            }

            function moveBokyUp() {
                if (boky.y >= boky.step) {
                    boky.y -= boky.step;
                }
            }
            function moveBokyDown() {
                if (boky.y <= (canvas.height - boky.height - boky.step)) {
                    boky.y += boky.step;
                }
            }
            function moveBokyLeft() {
                if (boky.x >= boky.step) {
                    boky.x -= boky.step;
                }
            }
            function moveBokyRight() {
                if (boky.x <= canvas.width - boky.width) {
                    boky.x += boky.step;
                }
            }

        }

        function loadCody() {
            cody.image = new Image();
            cody.image.onload = function() {
                loopCody(0);
            };
            cody.image.src = cody.src;
        }

        function codyFlyingUpAndDown() {
            if (cody.flyingUp && cody.y >= 0) {
                cody.y -= cody.step;
                if (cody.y === 0) {
                    cody.flyingUp = false;
                }
            }

            if (cody.flyingUp === false && cody.y <= canvas.height - cody.height) {
                cody.y += cody.step;
                if (cody.y >= (canvas.height - cody.height)) {
                    cody.flyingUp = true;
                }
            }
        }

        function loadVillain() {
            villain.image = new Image();
            villain.image.onload = function() {
                loopVillain(0);
            };
            villain.image.src = villain.src;
        }

        function detectCollide(obj1, obj2) {
            if (obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.height + obj1.y > obj2.y) {
                // Collision détectée
                console.log('Tu m\'as eu !');
                return true;
            } else {
                // Pas de collision détectée
                return false;
            }
        }

        function loadGameTheme() {
            gameTheme.audio = new Audio('./music/Brave%20World.wav');
            gameTheme.audio.onload = function() {
                loopGameTheme();
            };
        }

        function start() {
            if(looping) return;
            looping = true;
            lastFrameTime = Date.now();
            requestAnimationFrame(loop);
        }

        function stop() {
            looping = false;
        }

        function loop() {
            if (!looping) {
                return;
            }

            requestAnimationFrame(loop);

            var now = Date.now();
            totalSeconds += (now - lastFrameTime) / 1000;
            lastFrameTime = now;
            loopBackground();
            loopBoky();
            loopCody();
            loopVillain();
            loopGameTheme();
            var collide = detectCollide(boky, villain);
        }

        function loopBackground() {
             var numImages = Math.ceil(canvas.width / background.image.width) + 1;
             var xpos = totalSeconds * background.motion % background.image.width;

             context.save();
             context.translate(-xpos, 0);
             for (var i = 0; i < numImages; i++) {
                 context.drawImage(background.image, i * background.image.width, 0);
             }
             context.restore();
        }

        function loopBoky() {
            context.drawImage(boky.image, boky.frame * boky.width, 0, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
            boky.frame = (boky.frame + 1) % boky.attacking.numberOfFrames;
            moveBoky();
        }

        function loopCody() {
            codyFlyingUpAndDown();
            context.drawImage(cody.image, cody.frame * cody.width, 0, cody.width, cody.height, cody.x, cody.y, cody.width, cody.height);
            cody.frame = (cody.frame + 1) % cody.flying.numberOfFrames;
        }

        function loopVillain() {
            context.drawImage(villain.image, villain.frame * villain.width, 0, villain.width, villain.height, villain.x, villain.y, villain.width, villain.height);
            villain.frame = (villain.frame + 1) % villain.flying.numberOfFrames;
        }

        function loopGameTheme() {
            gameTheme.audio.play();
        }

        return {
            start: start,
            stop: stop,
            load: loadGame
        }
    }

    var canvas = document.getElementById('canvas');
    var bokyGame = Game(canvas);
    bokyGame.load();
    setTimeout(bokyGame.start, 500);


    document.getElementById('btnStart').addEventListener('click', function() {
        bokyGame.start();
        // gameTheme.audio.play();
    });

    document.getElementById('btnStop').addEventListener('click', function() {
        bokyGame.stop();
        // gameTheme.audio.stop();
    });

// ----------------------------------------------------------------------
    // ========== Movements Boky ==========
/*
    var FPS = 60;
    var movingInterval = -1;
    var boky = document.getElementById('frame');

    function initBoky() {
        boky.style.top = bokyStartTop + 'px';
        boky.style.left = bokyStartLeft + 'px';
    }

    document.onkeydown = movementsBoky;

    function movementsBoky(event) {
        var direction;

        var moveUp = function(element, step) {
            var top = element.style.top;
            element.style.top = parseFloat(top) - step + 'px';
        };

        var moveDown = function(element, step) {
            var top = element.style.top;
            element.style.top = parseFloat(top) + step + 'px';
            //if (element === )
        }

        var moveRight = function(element, step) {
            var left = element.style.left;
            element.style.left = parseFloat(left) + step + 'px';
        }

        var moveLeft = function(element, step) {
            var left = element.style.left;
            element.style.left = parseFloat(left) - step + 'px';
        };

        switch(event.keyCode) {

            case 38: // Up arrow key
                direction = 'up';
                break;

            case 40: // Down arrow key
                direction = 'down';
                break;

            case 37: // Left arrow key
                direction = 'left';
                break;

            case 39: // Right arrow key
                direction = 'right';
                break;

            default:

        }

        startMoving();

        function startMoving() {
            if(movingInterval === -1) {
                // direction
                var directionFunction;
                //
                if (direction === 'up') {
                    directionFunction = moveUp;
                } else if (direction === 'down') {
                    directionFunction = moveDown;
                } else if (direction === 'left') {
                    directionFunction = moveLeft;
                } else if (direction === 'right') {
                    directionFunction = moveRight;
                }

                movingInterval = setInterval(directionFunction, 1000 / FPS, boky, stepBoky);
            }
        }

    }

    document.onkeyup = function stopMoving() {
        clearInterval(movingInterval);
        movingInterval = -1;
    }
    initBoky();
*/
}());