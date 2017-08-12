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
        game.keybind(' '.charCodeAt(0), 'a');

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
                this.backgroundColor = '#777';
            },
        });
        var Bullet = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 5, 1);
                this.backgroundColor = '#f00';
            },
        });
        var EnemyBullet = enchant.Class.create(RotSprite, {
            initialize() {
                RotSprite.call(this, 5, 1);
                this.backgroundColor = '#000';
            },
        });

        //const gameScene = new Scene();
        //game.pushScene(gameScene);
        // FIXME
        const gameScene = game.rootScene;

        var enemyCnt = 0;
        for(let r = 0; r < enemyRow; r++) {
            for(let ci= 0; ci < 6; ci++)
                for(let c = 0; c < enemyCol/3; c++) {
                    const enemy = new Enemy();
                    enemy.r = 30*r + 200;
                    enemy.t = c * (-180) / enemyCol - 30 - (360/groupCnt*ci);
                    enemy.on('enterframe', function () {
                        if(frameindex % (30 * enemyCnt / (enemyRow * enemyCol)) == 0)
                            this.t -= 2;
                        if(frameindex % (500 * enemyCnt / (enemyRow * enemyCol)) == 0)
                            this.r-= 10;
                    });
                    gameScene.addChild(enemy);
                    enemyCnt++;
                }
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

        gameScene.on('enterframe', function () {
            frameindex++;
            countdown++;
            if(EnemyBullet.intersect(Player).length > 0) {
                alert('game over');
                game.stop();
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
        });
    }

    game.start();
}
