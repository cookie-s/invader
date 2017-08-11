const height = 320;
const width  = 320;
const enemyCnt = 20;

function moveCenter(x) {
    return x + height/2;
}

function updatePos(sprite) {
    sprite.x = moveCenter(sprite.r) - sprite.width / 2;
    sprite.y = moveCenter(0) - sprite.height / 2;
    sprite.originX = moveCenter(0) - sprite.x;
    sprite.originY = moveCenter(0) - sprite.y;
    sprite.rotation = sprite.t;
    sprite.debugColor = '#fff';
}

enchant();

window.onload = function () {
    const game = new Game(width, height);
    game.fps = 60;
    game.scale = 2;


    game.onload = function () {
        const gameScene = new Scene();
        game.pushScene(gameScene);

        let enemys = [];
        for(let i = 0; i < enemyCnt/2; i++) {
            const enemy = new Sprite(16, 16);
            enemy.backgroundColor = '#777';
            enemy.r = 100;
            enemy.t = i * 360 / (enemyCnt/2);
            updatePos(enemy);
            gameScene.addChild(enemy);
            enemys.push(enemy);
        }
        for(let i = 0; i < enemyCnt/2; i++) {
            const enemy = new Sprite(16, 16);
            enemy.backgroundColor = '#999';
            enemy.r = 130;
            enemy.t = (i + 0.5) * 360 / (enemyCnt/2)
            updatePos(enemy);
            gameScene.addChild(enemy);
            enemys.push(enemy);
        }

        const player = new Sprite(16, 16);
        player.r = 0;
        player.t = 0;
        updatePos(player);
        player.backgroundColor = '#0f0';

        gameScene.addEventListener('touchstart', function () {
            const bullet = new Sprite(4, 4);
            bullet.r = player.r + player.width/2;
            bullet.t = player.t;
            updatePos(bullet);
            bullet.backgroundColor = '#f00';

            bullet.tl
                .moveBy(1, 0, 2)
                .loop();
            gameScene.addChild(bullet);
        });
        gameScene.addChild(player);
    }

    game.start();
}
