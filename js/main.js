// ========== Anim Background Image du canvas ==========

(function() {
	// ========== Config ==========
	var backgroundMotion = 300; // Vitesse du background 100pixels/sec
    var stepBoky = 15;
    var bokyStartTop = 150;
    var bokyStartLeft = 30;

    // ========== Width & Height du canvas ==========
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var looping = false;
    var totalSeconds = 0;
    canvas.width = 1140;
    canvas.height = 570;
    // -------------------------------------------------------------------------
    window.requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || function(callback) { window.setTimeout(callback, 1000 / 60); };

    var img = new Image();
    img.onload = imageLoaded;
    img.src = './images/background/resized-space-full-bg.jpg';

    function imageLoaded() {
        draw(0);
        var btn = document.getElementById('btnStart');
        btn.addEventListener('click', function() {
            startStop();
        });
    }

    var lastFrameTime = 0;

    function startStop() {
        looping = !looping;
        if (looping) {
            lastFrameTime = Date.now();
            requestAnimationFrame(loop);
        }
    }

    function loop() {
        if (!looping) {
            return;
        }

        requestAnimationFrame(loop);

        var now = Date.now();
        var deltaSeconds = (now - lastFrameTime) / 1000;
        lastFrameTime = now;
        draw(deltaSeconds);
    }

    function draw(delta) {
        totalSeconds += delta;
         var numImages = Math.ceil(canvas.width / img.width) + 1;
         var xpos = totalSeconds * backgroundMotion % img.width;

         context.save();
         context.translate(-xpos, 0);
         for (var i = 0; i < numImages; i++) {
             context.drawImage(img, i * img.width, 0);
         }
         context.restore();
    }

// ----------------------------------------------------------------------
    // ========== Movements Boky ==========

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

}());