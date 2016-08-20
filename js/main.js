(function() {
    function Game(canvas) {

        // ========== Config du canvas ==========
        var context = canvas.getContext('2d');
        canvas.width = 1140;
        canvas.height = 570;

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
            hurt: {
                numberOfFrames: 16
            },
            walking: {
                numberOfFrames: 16
            },
            direction: null,
            damaged: 0,
            touchedVillains: [],
            life: 50
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

        var Villain = {
            src: './images/sprite/villain-sprite.png',
            width: 60,
            height: 65,
            frame: 0,
            step: 5,
            spawnX: canvas.width - 60, // spawnsV at canvas width 1140px
            spawnFrequency: 1250, // spawns villains every 1.25s
            //spawnSpeed: 5, // sets how fast the villains move
            lastSpawn: 0, // when was the last villain spawned,
            untouched: [],
            number: 10,
            showing: {
                numberOfFrames : 2
            }
        };

        var gameTheme = {
            src: './music/Xingu%20Loop.wav',
            playing: true,
            loop: true
        };

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

        //========== Fonction de spawn des villains ==========
        function spawnVillains() {
            var time = Date.now();
            if (time > (Villain.lastSpawn + Villain.spawnFrequency)) {
                Villain.lastSpawn = time;
                Villain.untouched.push(loadVillain());
            }
        }
        //========== Chargement de villain ==========
        function loadVillain() {
            var villain = {}
            villain.width = 60,
            villain.height = 65,
            villain.x = Villain.spawnX,
            villain.y = Math.random() * (canvas.height - 100) + 50,
            villain.frame = 0;
            villain.image = new Image();
            villain.image.src = Villain.src;
            return villain;
        }

        // ========== Mouvement de villain ==========
        function villainMoving(villain) {
            villain.x -= Villain.step;
        }

        // ========== Détection de collisions ==========
        function detectCollide(obj1, obj2) {
            if (obj1.x < obj2.x + obj2.width && // posX Boky < posX Villain + width Villain
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.height + obj1.y > obj2.y) {
                // >>>>> Collision détectée
                return true;
            } else {
                // >>>>> Pas de collision détectée
                return false;
            }
        }

        // ========== Chargement de la musique du jeu ==========
        function loadGameTheme() {
            gameTheme.audio = new Audio();
            gameTheme.audio.src = gameTheme.src;
            gameTheme.audio.loop = gameTheme.loop;
            if (gameTheme.playing) {
                gameTheme.audio.play();
            }
        }

        // ========== Lance le game theme ==========
        function playTheme() {
            gameTheme.audio.play();
        }

        // ========== Arrête le game theme ==========
        function stopTheme() {
            gameTheme.audio.pause();
        }

        // ========== Mute/unmute le game theme ==========
        function toggleMuteTheme() {
            var muteBtn = document.getElementById('btnMute');
            if (gameTheme.audio.muted === true) {
                gameTheme.audio.muted = false;
                muteBtn.innerHTML = 'Mute';
            } else {
                gameTheme.audio.muted = true;
                muteBtn.innerHTML = 'Unmute';
            }
        }

        // ========== Détection de collision entre Boky et Villains, et comportement ==========
        function checkBokyLives() {
            for (var i = 0; i < Villain.untouched.length; i++) {
            // Parcourt le tableau de villains pour détecter s'il y a collision entre Boky et chaque villain
                var collide = detectCollide(boky, Villain.untouched[i]);
                var removedVillain;
                if (collide === true) {
                    boky.damaged = boky.hurt.numberOfFrames * 2;
                    removedVillain = Villain.untouched.splice(i, 1)
                    boky.touchedVillains.splice(-1, 0, removedVillain[0]);
                    boky.life -= 10;
                    if (boky.life <= 0) {
                        bokyGame.stop();
                    }
                }
            }
        }

        // ========== Début / Reprise du jeu ==========
        function start() {
            if(looping) return;
            looping = true;
            lastFrameTime = Date.now();
            requestAnimationFrame(loop);
            playTheme();
        }

        // ========== Arrêt / Pause du jeu ==========
        function stop() {
            looping = false;
            stopTheme();
        }

        // ========== Boucle les animations du jeu ==========
        function loop() {
            if (!looping) {
                return;
            }

            requestAnimationFrame(loop);

            var now = Date.now();
            totalSeconds += (now - lastFrameTime) / 1000;
            lastFrameTime = now;
            spawnVillains();
            loopBackground();
            loopBoky();
            loopCody();
            loopVillains();
            checkBokyLives();

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
            if (boky.damaged > 0) {
                context.drawImage(boky.image, boky.frame * boky.width, 381, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
                boky.frame = (boky.frame + 1) % boky.hurt.numberOfFrames;
                boky.damaged -= 1; // Permet l'affichage de l'état hurt de Boky pendant toute la collision
            } else {
                context.drawImage(boky.image, boky.frame * boky.width, 762, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
                boky.frame = (boky.frame + 1) % boky.walking.numberOfFrames;
                moveBoky();
            }
        }

        // ========== Répétition de l'affichage de Cody ==========
        function loopCody() {
            codyFlyingUpAndDown();
            context.drawImage(cody.image, cody.frame * cody.width, 0, cody.width, cody.height, cody.x, cody.y, cody.width, cody.height);
            cody.frame = (cody.frame + 1) % cody.flying.numberOfFrames;
        }

        // ========== Répétition de l'affichage du villain ==========
        function loopVillains() {
            for(var i = 0; i < Villain.untouched.length; i++) {
                var villain = Villain.untouched[i];
                context.drawImage(villain.image, villain.frame * Villain.width, 0, Villain.width, Villain.height, villain.x, villain.y, Villain.width, Villain.height);
                villain.frame = (villain.frame + 1) % Villain.showing.numberOfFrames;
                villainMoving(villain);
            }
            if (boky.damaged === true) {

            }
        }

        return {
            start: start,
            stop: stop,
            toggleMuteTheme: toggleMuteTheme,
            load: loadGame
        }

    } // << Fin de la fonction Game >>

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
        bokyGame.toggleMuteTheme();
    });


}()); // << Fin de la main function >>