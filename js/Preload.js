var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');

    // bgStuff
    this.load.image('cloud1', 'assets/images/platformerGraphicsDeluxe_Updated/Items/cloud1.png');
    this.load.image('bush', 'assets/images/platformerGraphicsDeluxe_Updated/Items/bush.png');
    this.load.image('mushroomRed', 'assets/images/platformerGraphicsDeluxe_Updated/Items/mushroomRed.png');
    this.load.image('plant', 'assets/images/platformerGraphicsDeluxe_Updated/Items/plant.png');
    this.load.image('rock', 'assets/images/platformerGraphicsDeluxe_Updated/Items/rock.png');
    this.load.image('cactus', 'assets/images/platformerGraphicsDeluxe_Updated/Items/cactus.png');
    this.load.image('hill_smallAlt', 'assets/images/platformerGraphicsDeluxe_Updated/Tiles/hill_smallAlt.png');
    this.load.image('signExit', 'assets/images/platformerGraphicsDeluxe_Updated/Tiles/signExit.png');

    this.load.image('player', 'assets/images/player.png');
    this.load.image('playerDuck', 'assets/images/player_duck.png');
    this.load.image('playerDead', 'assets/images/player_dead.png');

    this.load.image('player2', 'assets/images/player2.png');
    this.load.image('playerDuck2', 'assets/images/player2_duck.png');
    this.load.image('playerDead2', 'assets/images/player2_dead.png');

    this.load.image('dad', 'assets/images/dad.png');

    this.game.load.spritesheet('p1', 'assets/images/p1.png', 75, 92, 2)
    this.game.load.spritesheet('p2', 'assets/images/p2.png', 87, 92, 2)
    this.game.load.spritesheet('d', 'assets/images/d.png', 75, 92, 2)

    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
  },
  create: function() {
    this.state.start('Game');
  }
};
