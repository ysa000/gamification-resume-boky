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
            }
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
                        moveBokyUp();
                        break;

                    case 40: // Down
                        moveBokyDown();
                        break;

                }
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
    setTimeout(bokyGame.start, 1000);


    document.getElementById('btnStart').addEventListener('click', function() {
        bokyGame.start();
    });

    document.getElementById('btnStop').addEventListener('click', function() {
        bokyGame.stop();
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