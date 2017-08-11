const height = 120;
const width  = 120;
const enemyCnt = 10;

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

    game.onload = function () {
    }
    const gameScene = new Scene();
    game.pushScene(gameScene);

    let enemys = [];
    for(let i = 0; i < enemyCnt; i++) {
        const enemy = new Sprite(16, 16);
        enemy.backgroundColor = '#777';
        enemy.r = 50;
        enemy.t = i * 360 / enemyCnt;
        updatePos(enemy);
        gameScene.addChild(enemy);
        enemys.push(enemy);
    }

    const player = new Sprite(16, 16);
    player.r = 0;
    player.t = 0;
    updatePos(player);
    player.backgroundColor = '#0f0';

    gameScene.addChild(player);

    game.start();
}
