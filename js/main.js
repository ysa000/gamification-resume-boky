(function() {
    function Game(canvas) {

    	// ========== Config ==========
        var background = {
            src: './images/background/resized-space-full-bg.jpg',
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

        var villain = {
            src: './images/sprite/villain-sprite.png',
            width: 60,
            height: 65,
            frame: 0,
            x: 1080,
            y: 250,
            movingLeft: true,
            step: 5,
            showing: {
                numberOfFrames : 2
            }
        };

        var gameTheme = {
            src: './music/Brave%20World.wav',
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
            loadVillain();
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

        // ========== Chargement du villain ==========
        function loadVillain() {
            villain.image = new Image();
            villain.image.onload = function() {
                loopVillain(0);
            };
            villain.image.src = villain.src;
        }

        // ========== Mouvement villain qui traverse la width du canvas de droite à gauche ==========
        function villainMoving() {
            // console.log(villain.movingRight); // false
            // console.log(villain.x); // 1080
            if (villain.movingLeft && villain.x >= 0) {
                villain.x -= villain.step;
                if (villain.x <= 0) {
                    villain.movingLeft = false;
                }
            }
        }

        // ========== Gestionnaire d'affichage des villains ==========
        // function villainManager() {
        //     this.villains = [];
        //     this.step = 5;
        //     this.spawnFrequency = 1200;
        //     this.spawnTimer = 0;

        //     this.spawnEnemy = function(currentTime) {
        //         var skull = new villain(currentTime);
        //         villain.x = canvas.width;
        //         villain.y = Math.random() * (canvas.height - villain.height);
        //         console.log('Spawned villain !');
        //         this.villains.push(skull);
        //     }

        //     this.update = function(timeElapsed, currentTime) {
        //         this.spawnTimer += timeElapsed;
        //         if (this.spawnTimer > this.spawnFrequency) {
        //             this.spawnEnemy(currentTime);
        //             this.spawnTimer = 0
        //         }

        //         for (var i = 0; i < this.villains.length; i++) {
        //             var skull = this.villains[i];
        //             if (skull !== null) {
        //                 villain.x += this.step;

        //                 if (skull.x < 0 - villain.width) {
        //                     this.killSkull(skull);
        //                 }
        //             }
        //         }
        //     }

        //     this.draw = function(canvas, timeElapsed, currentTime) {
        //         var
        //     }





        // }

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

        // ========== Chargement de la musique du jeu
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
            //loopGameTheme();
            var collide = detectCollide(boky, villain);
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
        function loopVillain() {
            villainMoving();
            context.drawImage(villain.image, villain.frame * villain.width, 0, villain.width, villain.height, villain.x, villain.y, villain.width, villain.height);
            villain.frame = (villain.frame + 1) % villain.showing.numberOfFrames;
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