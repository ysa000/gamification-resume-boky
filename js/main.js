(function() {
    function Game(canvas) {

    	// ========== Config ==========
        var background = {
            src: './images/background/resized-mountain-full-bg.jpg',
            motion: 300
        };

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
        };

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
        };

        var villains = {
            src: './images/sprite/villain-sprite.png',
            width: 60,
            height: 65,
            frame: 0,
            x: 1080,
            y: 250,
            movingLeft: true,
            step: 5,
            spawnX: canvas.width, // spawns villains at canvas width 1140px
            spawnFrequency: 1250, // spawns villains every 1.25s
            spawnSpeed: 5, // sets how fast the villains move
            lastSpawn: -1, // when was the last villain spawned,
            array: [],
            number: 10,
            showing: {
                numberOfFrames : 2
            }
        };

        var gameTheme = {
            playing: true,
            src: './music/Xingu%20Loop.wav'
        };

        // ========== Config du canvas ==========
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
            loadVillains();
            loadGameTheme();
        }

        // ========== Chargement du background ==========
        function loadBackground () {
            background.image = new Image();
            background.image.onload = function() {
                loopBackground(0)
            };
            background.image.src = background.src;
        }

        // ========== Chargement de Boky ==========
        function loadBoky() {
            boky.image = new Image();
            boky.image.onload = function() {
                loopBoky(0);
            };
            boky.image.src = boky.src;
        }

        // ========== Chargement et déf des contrôles de Boky ==========
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

        // ========== Chargement de Cody ==========
        function loadCody() {
            cody.image = new Image();
            cody.image.onload = function() {
                loopCody(0);
            };
            cody.image.src = cody.src;
        }

        // ========== Chargement et déf du mouvement de Cody
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

        //========== Chargement du villain ==========
        function loadVillains() {
            for(var i = 0; i < villains.number; i++) {
                villains.array.push(loadVillain());
            }

            function loadVillain() {
                var villain = {}
                villain.x = villains.spawnX,
                villain.y = Math.random() * (canvas.height - 100) + 50,
                villain.frame = 0;
                villain.image = new Image();
                villain.image.src = villains.src;
                return villain;
            }
        }

        function villainMoving() {
            if (villains.movingLeft && villains.x >= !canvas.width - villains.width) {
                villains.x -= villains.step;
            }
        }

        // ========== Détection de collisions ==========
        function detectCollide(obj1, obj2) {
            if (obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.height + obj1.y > obj2.y) {
                // >>>>> Collision détectée
                console.log('Touché !');
                return true;
            } else {
                // >>>>> Pas de collision détectée
                return false;
            }
        }

        // ========== Chargement de la musique du jeu ==========
        function loadGameTheme() {
            gameTheme.audio = new Audio();
            gameTheme.audio.onload = function() {
                loopGameTheme();
            };
            gameTheme.audio.src = gameTheme.src;
        }

        // ========== Fonction de mute/unmute la musique du jeu depuis le #btnMute ==========
        function muteGameTheme() {
            var muteBtn = document.getElementById('btnMute');
            if (!gameTheme.audio.muted) {
                gameTheme.audio.muted = false;
                muteBtn.innerHTML = 'Unmute';
            } else {
                gameTheme.audio.muted = true;
                muteBtn.innerHTML = 'Mute';
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
            loopCody();
            loopVillains();
            loopGameTheme();
            var collide = detectCollide(boky, villains);
        }

        // ========== Répétition du défilement du background ==========
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

        // ========== Répétition de l'affichage de Boky ==========
        function loopBoky() {
            context.drawImage(boky.image, boky.frame * boky.width, 0, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
            boky.frame = (boky.frame + 1) % boky.attacking.numberOfFrames;
            moveBoky();
        }

        // ========== Répétition de l'affichage de Cody ==========
        function loopCody() {
            codyFlyingUpAndDown();
            context.drawImage(cody.image, cody.frame * cody.width, 0, cody.width, cody.height, cody.x, cody.y, cody.width, cody.height);
            cody.frame = (cody.frame + 1) % cody.flying.numberOfFrames;
        }

        // ========== Répétition de l'affichage du villain ==========
        function loopVillains() {
            // villainMoving();
            for(var i = 0; i < villains.array.length; i++) {
                var villain = villains.array[i];
                context.drawImage(villain.image, villain.frame * villains.width, 0, villains.width, villains.height, villain.x, villain.y, villains.width, villains.height);
                villain.frame = (villain.frame + 1) % villains.showing.numberOfFrames;
            }
        }

        // ========== Répétition de la musique du jeu ==========
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
    });

    document.getElementById('btnStop').addEventListener('click', function() {
        bokyGame.stop();
    });


    document.getElementById('btnMute').addEventListener('click', function() {
        bokyGame.muteGameTheme();
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