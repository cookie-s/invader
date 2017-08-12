const height = 640;
const width  = 640;
const enemyRow = 4;
const enemyCol = 15;
const groupCnt = 3;

function moveCenter(x) {
    return x + height/2;
}

function updatePos(sprite) {
    sprite.x = moveCenter(sprite.r * Math.cos(sprite.t * Math.PI / 180)) - sprite.width / 2;
    sprite.y = moveCenter(sprite.r * Math.sin(sprite.t * Math.PI / 180)) - sprite.height / 2;
    sprite.rotation = sprite.t;
}

enchant();

window.onload = function () {
    const game = new Core(width, height);
    game.fps = 60;
    var frameindex = 0;

    game.onload = function () {
        game.rootScene.backgroundColor = '#000';
        game.keybind(' '.charCodeAt(0), 'a');
        game.keybind('Z'.charCodeAt(0), 'a');
        game.keybind('X'.charCodeAt(0), 'b');

        var RotSprite = enchant.Class.create(enchant.Sprite, {
            initialize(x, y) {
                enchant.Sprite.call(this, x, y);
                this._r = 0;
                this._t = 0;
                updatePos(this);
            },

            r: {
                get() {
                    return this._r;
                },
                set(_r) {
                    this._r = _r;
                    updatePos(this);
                },
            },

            t: {
                get() {
                    return this._t;
                },
                set(_t) {
                    this._t = _t;
                    updatePos(this);
                }
            }
        });

        var Player = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 16, 16);
                this.backgroundColor = '#0f0';
            },
        });
        var Enemy = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 16, 16);
                this.backgroundColor = '#555';
            },
        });
        var Bullet = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 5, 2);
                this.backgroundColor = '#f00';
            },
        });
        var EnemyBullet = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 5, 2);
                this.backgroundColor = '#ccc';
            },
        });

        const gameScene = new Scene();
        const menuScene = new Scene();

        const startLabel = new Label();
        !function (label) {
            label.text = 'GAME START';
            label.textAlign = 'center';
            label.color = 'white';
            label.x = (game.width - label.width)/2;
            label.y = (game.height - label.height)/2;
            label.on('touchstart', function () {
                game.replaceScene(gameScene);
            });
            menuScene.addChild(label);
        } (startLabel);
        const titleLabel = new Label();
        !function (label) {
            label.text = 'INVADER';
            label.textAlign = 'center';
            label.color = 'white';
            label.x = (game.width - label.width)/2;
            label.y = (game.height/2 - label.height)/2;
            label.on('touchstart', function () {
                game.replaceScene(gameScene);
            });
            menuScene.addChild(label);
        } (titleLabel);
        game.pushScene(menuScene);

        gameScene.on('enter', function () {
            var bomb = 3;

            var enemyCnt = 0;
            for(let r = 0; r < enemyRow; r++) {
                for(let ci= 0; ci < 6; ci++)
                    for(let c = 0; c < enemyCol/3; c++) {
                        const enemy = new Enemy();
                        enemy.r = 30*r + 200;
                        enemy.t = c * (-180) / enemyCol - 30 - (360/groupCnt*ci);
                        enemy.on('enterframe', function () {
                            if(frameindex % Math.floor(30 * enemyCnt / (enemyRow * enemyCol)) == 0)
                                this.t -= 2;
                            if(frameindex % Math.floor(500 * enemyCnt / (enemyRow * enemyCol)) == 0)
                                this.r-= 10;
                        });
                        gameScene.addChild(enemy);
                        enemyCnt++;
                    }
            }
            {
                const UFO = new Enemy();
                UFO.r = 310;
                UFO.t = Math.random() * 360;
                UFO.on('enterframe', function () {
                    if(Math.floor(Math.random() * 20) == 0)
                        this.t = (this.t + Math.random() * 120) % 360;
                });
                gameScene.addChild(UFO);
                enemyCnt++;
            }

            var player = new Player();
            player.r = 50;
            player.t = -90;
            player.tl
                .then( function () {
                    if (game.input.left)
                        this.t--;
                    if (game.input.right)
                        this.t++;
                })
                .delay(1)
                .loop()

            gameScene.addChild(player);

            var countdown = 50;
            function makeBullet() {
                if(countdown < 50) return;
                countdown = 0;
                const bullet = new Bullet();
                bullet.r = player.r + player.width/2 + bullet.width/2;
                bullet.t = player.t;

                gameScene.addChild(bullet);
                bullet.tl
                    .then( function () { this.r += 1 } )
                    .delay(1)
                    .loop();
            }

            gameScene.on('touchstart', makeBullet);
            gameScene.on('abuttondown', makeBullet);
            gameScene.on('bbuttondown', function () {
                if(bomb > 0) {
                    const bullet = new Bullet();
                    bullet.r = player.r + player.width/2 + bullet.width/2;
                    bullet.t = player.t;
                    gameScene.addChild(bullet);
                    bullet.tl
                        .then( function () { this.t += 3; this.r++; } )
                        .delay(1)
                        .loop();
                    bomb--;
                }
            });

            gameScene.on('enterframe', function () {
                frameindex++;
                countdown++;
                if(EnemyBullet.intersect(Player).length > 0) {
                    game.stop();
                    game.rootScene.backgroundColor = 'red';
                }
                for(const [bullet, ebullet] of (Bullet.intersect(EnemyBullet))) {
                    gameScene.removeChild(bullet);
                    gameScene.removeChild(ebullet);
                }
                for(const [enemy, bullet] of (Enemy.intersect(Bullet))) {
                    gameScene.removeChild(enemy);
                    gameScene.removeChild(bullet);
                    enemyCnt--;
                }

                for(const enemy of Enemy.collection) {
                    if(Math.random() <= 0.0002) {
                        const bullet = new EnemyBullet();
                        bullet.r = enemy.r - enemy.width/2 - bullet.width/2;
                        bullet.t = enemy.t;

                        gameScene.addChild(bullet);
                        bullet.tl
                            .then( function () { this.r -= 1 } )
                            .delay(1)
                            .loop();
                    }
                }

                if(enemyCnt == 0) {
                    game.stop();
                    alert('congrats!!!!!');
                }
            });
        });
    }

    game.start();
}
