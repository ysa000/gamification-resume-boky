(function() {
    var bokyGame;
    var displayCanvas = document.getElementById('displayCanvas');

    function Game(canvas) {


        // ========== Config du canvas ==========
        var context = canvas.getContext('2d');
        canvas.width = 1140;
        canvas.height = 570;


        // ========== Config ==========

        var background = {
            src: './images/background/resized-mountain-full-bg.jpg',
            motion: 300,
            groundSize: 70
        };

        var boky = {
            src: './images/sprite/cody-sprite.png',
            width: 89,
            height: 70,
            frame: 0,
            x: 20,
            y: 235,
            step: 15,
            attacking: {
                numberOfFrames: 16
            },
            hurt: {
                numberOfFrames: 16
            },
            happy: {
                numberOfFrames: 24
            },
            flying: {
                numberOfFrames: 4
            },
            direction: null,
            damaged: 0,
            touchedVillains: [],
            touchedLogos: [],
            life: 3,
            bonusAnimation: 0,
            score: 0
        };

        var cody = {
            src: './images/sprite/boky-sprite.png',
            width: 185,
            height: 127,
            frame: 0,
            x: 955,
            y: 200,
            flyingUp: true,
            step: 8,
            walking: {
                numberOfFrames: 16
            }
        };

        var Villain = {
            src: './images/sprite/villain-sprite.png',
            width: 60,
            height: 65,
            spawnX: canvas.width,
            frame: 0,
            step: 5,
            untouched: [],
            showing: {
                numberOfFrames : 2
            }
        };

        var gameTheme = {
            src: './music/Xingu%20Loop.wav',
            playing: true,
            loop: true
        };

        // ========== Constructeur d'un objet type (logos) ==========
        function logo(name, src, width, height) {
            this.name = name;
            this.src = src;
            this.width = width;
            this.height = height;
            this.spawnX = canvas.width;
            this.frame = 0;
            this.step = 5;
            this.numberOfFrames = 1;
        }

        // ========== Création de logos ==========
        var htmlLogo = new logo('HTML5', './images/logos/html5.png', 60, 68);
        var cssLogo = new logo('CSS3', './images/logos/css3.png', 60, 68);
        var javascriptLogo = new logo('JavaScript', './images/logos/javascript.png', 60, 60);
        var jqueryLogo = new logo('jQuery', './images/logos/jquery.png', 60, 60);
        var angularLogo = new logo('AngularJS', './images/logos/angularjs.png', 60, 64)
        var nodejsLogo = new logo('NodeJS', './images/logos/nodejs.png', 60, 68);
        var mongodbLogo = new logo('MongoDB', './images/logos/mongodb.png', 27, 60);
        var expressLogo = new logo('ExpressJS', './images/logos/express.png', 60, 60);
        var meteorLogo = new logo('Meteor', './images/logos/meteor.png', 60, 57);
        var githugLogo = new logo('Github', './images/logos/github.png', 60, 60);

        // ========== Stockage des logos dans un tableau ==========

        var logoArray = [
            htmlLogo,
            cssLogo,
            javascriptLogo,
            jqueryLogo,
            angularLogo,
            nodejsLogo,
            mongodbLogo,
            expressLogo,
            meteorLogo,
            githugLogo
        ];

        // ========== Stockage des logos ==========

        var untouchedLogos = []; // qui n'ont pas été attrapés

        // ========== Variables d'animation du canvas ====
        var looping = false;
        var totalSeconds = 0;
        var lastFrameTime = 0;
        var spawnCpt = 0;
        var spawnBonusCpt = 0;
        var spawnFrequency = 1250; // Fréquence de spawn (1.25s)
        var lastSpawn =  0; // Quand le dernier élément a été spawné

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

        // ========== Mise à 0 des éléments du canvas ==========
        function deleteGame() {
            stop();
            background = null;
            logoArray = null;
            gameTheme = null;
            boky = null;
            cody = null;
            canvas = null;
            context = null;
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
                if (boky.y <= (canvas.height - (boky.height - boky.step + background.groundSize + 20))) { // 90px supp pour limiter la hauteur min de déplacement de Boky
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
                if (cody.y >= (canvas.height - cody.height - background.groundSize)) {
                    cody.flyingUp = true;
                }
            }
        }

        //========== Fonction de spawn des villains ==========
        function spawnBonusAndVillains() {
            var time = Date.now();
            if (time > (lastSpawn + spawnFrequency)) {
                lastSpawn = time;
                if(spawnCpt % 3 === 0 && spawnBonusCpt < logoArray.length) {
                    untouchedLogos.push(loadLogo(spawnBonusCpt));
                    spawnBonusCpt++;
                    // Stop le jeu lorsque tous les logos ont été spawnés et qu'il y en ai au moins un de manqué
                    if (spawnBonusCpt === logoArray.length) {
                        setTimeout(bokyGame.stop, 3000);
                        setTimeout(loopYouLostText, 3000);
                    }
                } else {
                    Villain.untouched.push(loadVillain());
                }
                spawnCpt++;
            }
        }
        //========== Chargement de villain ==========
        function loadVillain() {
            var villain = {}
            villain.width = 60,
            villain.height = 65,
            villain.x = Villain.spawnX,
            villain.y = Math.random() * (canvas.height - 100 - background.groundSize) + 50,
            villain.frame = 0;
            villain.image = new Image();
            villain.image.src = Villain.src;
            return villain;
        }

        // ========== Mouvement de villain ==========
        function villainMoving(villain) {
            villain.x -= Villain.step;
        }

        //========== Chargement des logos ==========
        function loadLogo(i) {
            var logo = {};
            logo.width = logoArray[i].width;
            logo.height = logoArray[i].height;
            logo.x = logoArray[i].spawnX;
            logo.y = Math.random() * (canvas.height - 100 - background.groundSize) + 50;
            logo.frame = logoArray[i].frame;
            logo.step = logoArray[i].step;
            logo.numberOfFrames = logoArray[i].numberOfFrames;
            logo.image = new Image();
            logo.image.src = logoArray[i].src;
            return logo;
        }

        // ========== Mouvement des logos ==========
        function logoMoving(logo) {
            logo.x -= logo.step;
        }

        function detectCollide(obj1, obj2) {
            if (obj1.x < obj2.x + obj2.width &&
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
        }

        // ========== Lance le game theme ==========
        function playTheme() {
            if (gameTheme.playing) {
                gameTheme.audio.play();
            }
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
                muteBtn.innerHTML = '<i class="fa fa-volume-off fa-lg" aria-hidden="true"></i> Mute';
            } else {
                gameTheme.audio.muted = true;
                muteBtn.innerHTML = '<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i> Unmute';
            }
        }

        // ========== Détection de collision entre Boky et Villains, et comportement ==========
        function checkBokyLives() {
            for (var i = 0; i < Villain.untouched.length; i++) {
            // Parcourt le tableau de villains pour détecter s'il y a collision entre Boky et chaque villain
                var collideVillain = detectCollide(boky, Villain.untouched[i]);
                if (collideVillain === true) {
                    boky.damaged = boky.hurt.numberOfFrames * 2;
                    var removedVillain = Villain.untouched.splice(i, 1);
                    boky.touchedVillains.push(removedVillain[0]);
                    boky.life -= 1;
                    if (boky.life <= 0) {
                        setTimeout(bokyGame.stop, 500);
                    }
                }
            }
        }

        // ========== Détection de collision entre Boky et logos, et comportement ==========
        function checkBokyBonus() {
            for (var i = 0; i < untouchedLogos.length; i++) {
                // Parcourt le tableau de logos pour détecter s'il y a collision entre Boky et chaque logo
                var collideLogo = detectCollide(boky, untouchedLogos[i]);
                if (collideLogo === true) {
                    boky.bonusAnimation = boky.happy.numberOfFrames * 2;
                    var removedLogo = untouchedLogos.splice(i, 1);
                    boky.touchedLogos.push(removedLogo[0]);
                    boky.score += 1;
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

        // ========== Play/Pause du jeu
        function togglePlayPause() {
            if (looping) {
                looping = false;
                stopTheme();
                btnPlayPause.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Play';
                context.font = '40px Pacifico';
                context.fillText('PAUSE', 500, 275);
            } else {
                btnPlayPause.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Play';
                looping = true;
                loop();
                playTheme();
                btnPlayPause.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i> Pause';
            }
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
            spawnBonusAndVillains();
            loopBackground();
            loopBoky();
            loopCody();
            loopVillains();
            checkBokyLives();
            checkBokyBonus();
            loopScoreText();
            loopObjectiveText();
            loopLogo();

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

        // ========== Affichage Game Over liés points de vie de Boky ==========
        function loopScoreText() {
            context.font = '40px Pacifico';
            context.fillText('Life : ' + boky.life + ' / 3', 50, 50);
            if (boky.life === 0) {
                context.font = '60px Pacifico';
                context.fillText('Game Over', 425, 250);
                context.font = '40px Pacifico';
                context.fillText('Try again', 500, 300);
            }
        }

        // ========== Affichage skills de Boky ==========
        function loopObjectiveText() {
            context.font = '40px Pacifico';
                context.fillText('Skills : ' + boky.score + ' / 10', 850, 50);
            if (boky.score === 10) {
                context.font = '60px Pacifico';
                context.fillText('You win', 400, 250);
            }
        }

        // ========== Affichage Game Over liés skills de Boky ==========
        function loopYouLostText() {
            if (boky.score !== 10) {
                context.font = '60px Pacifico';
                context.fillText('You\'ve lost', 400, 250);
                context.font = '40px Pacifico';
                context.fillText('You missed ' + (logoArray.length - boky.score) + ' skills', 400, 300);
            }
        }

        // ========== Répétition de l'affichage de Boky ==========
        function loopBoky() {
            // if (boky.damaged > 0) {
            //     context.drawImage(boky.image, boky.frame * boky.width, 381, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
            //     boky.frame = (boky.frame + 1) % boky.hurt.numberOfFrames;
            //     boky.damaged -= 1; // Permet l'affichage de l'état hurt de Boky pendant toute la collision
            // } else if (boky.bonusAnimation > 0) {
            //     context.drawImage(boky.image, boky.frame * boky.width, 508, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
            //     boky.frame = (boky.frame + 1) % boky.happy.numberOfFrames;
            //     boky.bonusAnimation -= 1;
            //     moveBoky();
            // } else {
                context.drawImage(boky.image, boky.frame * boky.width, 0, boky.width, boky.height, boky.x, boky.y, boky.width, boky.height);
                boky.frame = (boky.frame + 1) % boky.flying.numberOfFrames;
                moveBoky();
            // }
        }

        // ========== Répétition de l'affichage de Cody ==========
        function loopCody() {
            if(boky.score === 10) {
                codyFlyingUpAndDown();
                context.drawImage(cody.image, cody.frame * cody.width, 762, cody.width, cody.height, cody.x, cody.y, cody.width, cody.height);
                cody.frame = (cody.frame + 1) % cody.walking.numberOfFrames;
            }
        }
        // ========== Répétition de l'affichage du villain ==========
        function loopVillains() {
            for (var i = 0; i < Villain.untouched.length; i++) {
                var villain = Villain.untouched[i];
                context.drawImage(villain.image, villain.frame * Villain.width, 0, Villain.width, Villain.height, villain.x, villain.y, Villain.width, Villain.height);
                villain.frame = (villain.frame + 1) % Villain.showing.numberOfFrames;
                villainMoving(villain);
            }
        }

        // ========== Répétition de l'affichage des logos ==========
        function loopLogo() {
            for (var i = 0; i < untouchedLogos.length; i++) {
                var logo = untouchedLogos[i];
                context.drawImage(logo.image, logo.frame * logo.width, 0, logo.width, logo.height, logo.x, logo.y, logo.width, logo.height);
                logo.frame = (logo.frame + 1) % logo.numberOfFrames;
                logoMoving(logo);
            }
        }

        return {
            start: start,
            stop: stop,
            togglePlayPause: togglePlayPause,
            toggleMuteTheme: toggleMuteTheme,
            load: loadGame,
            deleteGame: deleteGame
        }

    } // << Fin de la fonction Game >>

    function loadGameHtml() {
        var canvas = document.createElement('canvas');
        displayCanvas.appendChild(canvas);
        bokyGame = Game(canvas);
        bokyGame.load();
    }

    function restartGame() {
        if (bokyGame) {
            bokyGame.deleteGame();
            bokyGame = null;
        }

        cleanDom();
        loadGameHtml();
        if (bokyGame.timeout) {
            clearTimeout(bokyGame.timeout);
        }
        btnPlayPause.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i> Pause';
        btnMute.innerHTML = '<i class="fa fa-volume-off fa-lg" aria-hidden="true"></i> Mute';

        bokyGame.timeout = setTimeout(bokyGame.start, 50); // Temps de chargement du canvas

        function cleanDom() {
            while (displayCanvas.firstChild) {
                displayCanvas.removeChild(displayCanvas.firstChild);
            }
        }
    }

    document.getElementById('btnRestart').addEventListener('click', restartGame);

    document.getElementById('btnPlayPause').addEventListener('click', function() {
        bokyGame.togglePlayPause();
    });

    document.getElementById('displayCanvas').addEventListener('click', function() {
        bokyGame.togglePlayPause();
    });

    document.getElementById('btnMute').addEventListener('click', function() {
        bokyGame.toggleMuteTheme();
    });

    loadGameHtml();

}()); // << Fin de la main function >>