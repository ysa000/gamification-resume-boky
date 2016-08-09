// ========== Anim Background Image du canvas ==========

(function() {
    function Game(canvas) {

    	// ========== Config ==========
    	var backgroundMotion = 300; // Vitesse du background 300px/sec
        var stepBoky = 5; // Mouvement 5px
        var bokyStartTop = 200; // Position x de départ
        var bokyStartLeft = -10; // Position y de départ

        // ========== Width & Height du canvas ==========
        var context = canvas.getContext('2d');
        canvas.width = 1140;
        canvas.height = 570;

        // ========== Variables d'animation du canvas ====
        var looping = false;
        var totalSeconds = 0;
        var lastFrameTime = 0;
        var backgroundImg;

        // =========== Request Animation Frame ===========
        window.requestAnimationFrame = window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || function(callback) { window.setTimeout(callback, 1000 / 60); };

        function loadGame() {
            backgroundImg = new Image();
            backgroundImg.onload = function() {
                loopBackground(0)
            };
            backgroundImg.src = './images/background/resized-space-full-bg.jpg';
        }

        function start() {
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
            var deltaSeconds = (now - lastFrameTime) / 1000;
            lastFrameTime = now;
            loopBackground(deltaSeconds);
        }

        function loopBackground(delta) {
            totalSeconds += delta;
             var numImages = Math.ceil(canvas.width / backgroundImg.width) + 1;
             var xpos = totalSeconds * backgroundMotion % backgroundImg.width;

             context.save();
             context.translate(-xpos, 0);
             for (var i = 0; i < numImages; i++) {
                 context.drawImage(backgroundImg, i * backgroundImg.width, 0);
             }
             context.restore();
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