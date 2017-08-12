const height = 640;
const width  = 640;
const enemyRow = 4;
const enemyCol = 15;

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
    game.fps = 10;

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
                RotSprite.call(this, 4, 4);
                this.backgroundColor = '#f00';
            },
        });

        //const gameScene = new Scene();
        //game.pushScene(gameScene);
        // FIXME
        const gameScene = game.rootScene;

        let enemys = [];
        for(let r = 0; r < enemyRow; r++) {
            for(let c = 0; c < enemyCol; c++) {
                const enemy = new Enemy();
                enemy.r = 30*r + 200;
                enemy.t = c * -120 / enemyCol - 30;
                enemy.tl.clear()
                    .then( function () {
                        this.t -= enemyRow * enemyCol / enemys.length;
                    })
                    .delay(10)
                    .loop()
                gameScene.addChild(enemy);
                enemys.push(enemy);
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

        function makeBullet() {
            const bullet = new Bullet();
            bullet.r = player.r + player.width/2 + bullet.width/2;
            bullet.t = player.t;

            gameScene.addChild(bullet);
            bullet.tl
                .then( function () { this.r += 5 } )
                .delay(1)
                .loop();
        }

        gameScene.on('touchstart', makeBullet);
        gameScene.on('abuttondown', makeBullet);

        gameScene.on('enterframe', function () {
            for(const [enemy, bullet] of (Enemy.intersect(Bullet))) {
                gameScene.removeChild(enemy);
                gameScene.removeChild(bullet);
            }
        });
    }

    game.start();
}
