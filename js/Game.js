var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    this.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

    this.map.addTilesetImage('cloud1', 'cloud1');
    this.map.addTilesetImage('bush', 'bush');
    this.map.addTilesetImage('mushroomRed', 'mushroomRed');
    this.map.addTilesetImage('plant', 'plant');
    this.map.addTilesetImage('rock', 'rock');
    this.map.addTilesetImage('cactus', 'cactus');
    this.map.addTilesetImage('hill_smallAlt', 'hill_smallAlt');
    this.map.addTilesetImage('signExit', 'signExit');

    //create layers
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.bgStuff = this.map.createLayer('bgStuff');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    //create coins
    this.createCoins();

    //create player
    // this.player = this.game.add.sprite(130, 300, 'player');
    // this.player2 = this.game.add.sprite(50, 300, 'player2'); // new player
    // this.dad = this.game.add.sprite(-80, 350, 'dad'); // new player
    this.player = this.game.add.sprite(130, 300, 'p1');
    this.player.animations.add('walk');
    this.player2 = this.game.add.sprite(50, 300, 'p2'); // new player
    this.player2.animations.add('walk');
    this.dad = this.game.add.sprite(-80, 350, 'd'); // new player
    this.dad.animations.add('walk');

    this.player.animations.play('walk', 10, true);
    this.player2.animations.play('walk', 10, true);
    this.dad.animations.play('walk', 10, true);

    //enable physics on the player
    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.player2); // new player
    this.game.physics.arcade.enable(this.dad); // new player

    //player gravity
    this.player.body.gravity.y = 1000;
    this.player2.body.gravity.y = 1000;  // new player
    this.dad.body.gravity.y = 0;  // new player
    this.dad.body.immovable=true

    //properties when the player is ducked and standing, so we can use in update()
    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    // --> new player
    var playerDuckImg2 = this.game.cache.getImage('playerDuck2');
    this.player2.duckedDimensions = {width: playerDuckImg2.width, height: playerDuckImg2.height};
    this.player2.standDimensions = {width: this.player2.width, height: this.player2.height};
    this.player2.anchor.setTo(0.5, 1);
    // --> new player
    // var playerDuckImg2 = this.game.cache.getImage('playerDuck2');
    // this.player2.duckedDimensions = {width: playerDuckImg2.width, height: playerDuckImg2.height};
    this.dad.standDimensions = {width: this.dad.width, height: this.dad.height};
    this.dad.anchor.setTo(0.5, 1);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //init game controller
    // nir
    this.initGameController();

    //sounds
    this.coinSound = this.game.add.audio('coin');

    this.points = 0
    this.txtPoints = this.game.add.text(50, 50, "", { fontSize: '32px', fill: '#ffffff', boundsAlignH: "center", stroke: "black", strokeThickness: 4 })
    this.txtPoints.fixedToCamera=true

    this.txtStat = this.game.add.text(50, 100, "", { fontSize: '32px', fill: '#ffffff', boundsAlignH: "center", stroke: "red", strokeThickness: 4 })
    this.txtStat.fixedToCamera=true

  },

 //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    // --> new player
    this.game.physics.arcade.collide(this.player2, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player2, this.coins, this.collect, null, this);

    // collide with dad
    this.game.physics.arcade.collide(this.player, this.dad, this.playerHitsEnemy, null, this);
    this.game.physics.arcade.collide(this.player2, this.dad, this.playerHitsEnemy, null, this);
    if (
        this.dad.body.position.x > this.player.body.position.x
        && this.dad.body.position.x > this.player2.body.position.x
    ){
        this.dad.body.moves=false
    }
    if (!this.dad.body.touching.none) {
        // this.player.body.moves=false
        // this.player2.body.moves=false
        this.player.body.velocity.x = 0;
        this.player2.body.velocity.x = 0;
        this.dad.body.velocity.x = 0;
    }

    if (this.player.body.velocity.y==0) {
        this.player.loadTexture('p1');
        this.player.animations.play('walk', 10, true);
    }
    if (this.player2.body.velocity.y==0) {
        this.player2.loadTexture('p2');
        this.player2.animations.play('walk', 10, true);
    }

    //only respond to keys and keep the speed if the player is alive
    if(this.player.alive && this.player2.alive) {
      this.player.body.velocity.x = 330;
      this.player2.body.velocity.x = 330;  // new player
      this.dad.body.velocity.x = 330;  // new player
    //   this.txtPoints.body.velocity.x=300

      if(this.cursors.up.isDown) {
        this.playerJump();
      }
      else if(this.cursors.down.isDown || this.pressingDown) {
        this.playerDuck();
      }
      // --> new player
      if(this.cursors.left.isDown) {
        this.playerJump2();
      }
      else if(this.cursors.right.isDown || this.pressingDown2) {
        this.playerDuck2();
      }

      if(!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('p1');
        this.player.animations.play('walk', 10, true);
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }

      // --> new player
      if(!this.cursors.right.isDown && this.player2.isDucked && !this.pressingDown2) {
        //change image and update the body size for the physics engine
        this.player2.loadTexture('p2');
        this.player2.animations.play('walk', 10, true);
        this.player2.body.setSize(this.player2.standDimensions.width, this.player2.standDimensions.height);
        this.player2.isDucked = false;
      }

      //restart the game if reaching the edge
      if(this.player.x >= this.game.world.width) {
        // this.game.state.start('Game');
        this.txtStat.setText('Level 1 Complete')
        // this.player.loadTexture('playerDead');
        // TODO go to next level
      }
      if(this.player2.x >= this.game.world.width) {
        // this.game.state.start('Game');
        this.txtStat.setText('Level 1 Complete')
        // this.player.loadTexture('player2Dead');
        // TODO go to next level
      }
    }

  },
  playerHitsEnemy: function (player, enemy) {
      this.game.time.events.add(1500, this.gameOver, this);
  },
  playerHit: function(player, blockedLayer) {
    //if hits on the right side, die
    // || player2.body.blocked.right
    if(player.body.blocked.right ) {

//      console.log(player.body.blocked);
    //   console.log(player2.body.blocked);

      //set to dead (this doesn't affect rendering)
    //   this.player.alive = false;
    //   this.player2.alive = false; // new player

      //stop moving to the right
    //   this.player.body.velocity.x = 0;
    //   this.player2.body.velocity.x = 0; // new player
    //   this.dd.body.velocity.x = 0; // new player

      //change sprite image
    //   this.player.loadTexture('playerDead');
    //   this.player2.loadTexture('playerDead2'); // new player

      //go to gameover after a few miliseconds
    //   this.game.time.events.add(1500, this.gameOver, this);
    }
    // if(player2.body.blocked.right) {
    //
    //   console.log(player2.body.blocked);
    //
    //   //set to dead (this doesn't affect rendering)
    //   this.player.alive = false;
    //   this.player2.alive = false; // new player
    //
    //   //stop moving to the right
    //   this.player.body.velocity.x = 0;
    //   this.player2.body.velocity.x = 0; // new player
    //
    //   //change sprite image
    //   this.player.loadTexture('playerDead');
    //   this.player2.loadTexture('playerDead2'); // new player
    //
    //   //go to gameover after a few miliseconds
    //   this.game.time.events.add(1500, this.gameOver, this);
    // }
  },
  collect: function(player, collectable) {
    //play audio
    this.coinSound.play();

    //remove sprite
    collectable.destroy();
    this.points+=100
    this.txtPoints.setText(this.points)
  },
 
// :-)
  initGameController: function() {

    if(!GameController.hasInitiated) {
      var that = this;

      GameController.init({
          left: {
              type: 'none',
          },
//          left : ,
          right: {
              type: 'buttons',
              buttons: [
                {
                  label: '^',
                  touchStart: function() {
                    if(!that.player2.alive) {
                      return;
                    }
                    that.playerJump2();
                  },
                  touchEnd: function(){
                    that.pressingDown2 = false;
                  }
                },
                {
                  label: '^',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.playerJump();
                  },
                  touchEnd: function(){
                    that.pressingDown2 = false;
                  }
                },
                {
                  label: 'v',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.pressingDown = true; that.playerDuck();
                    console.log(1);
                  },
                  touchEnd: function(){
                    that.pressingDown = false; /*that.unDuck();*/
                    console.log(11);
                  }
                },
                {
                  label: 'v',
                  touchStart: function() {
                    if(!that.player2.alive) {
                      return;
                    }
                    that.pressingDown2 = true; that.playerDuck2();
                    console.log(2);
                  },
                  touchEnd: function(){
                    that.pressingDown2 = false;/* that.unDuck2();*/
                    console.log(22);
                  }
                }
              ]
          },
      });
      GameController.hasInitiated = true;
    }

  },
    
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  gameOver: function() {
    this.txtStat.setText('Game Over :(');
    this.game.state.start('Game');
  },
  playerJump: function() {
//    if (n==1 || n==undefined) {
      if(this.player.body.blocked.down) {
        this.player.body.velocity.y -= 700;
        // this.player.loadTexture('player');
        this.player.animations.stop()
        this.player.frame=1
      }
//    } else {
//      if(this.player2.body.blocked.down) {
//        this.player2.body.velocity.y -= 700;
//        // this.player2.loadTexture('player2');
//        this.player2.animations.stop()
//        this.player2.frame=1
//      }
//    }
  },
  playerJump2: function() {
//    if (n==1 || n==undefined) {
//      if(this.player.body.blocked.down) {
//        this.player.body.velocity.y -= 700;
//        // this.player.loadTexture('player');
//        this.player.animations.stop()
//        this.player.frame=1
//      }
//    } else {
      if(this.player2.body.blocked.down) {
        this.player2.body.velocity.y -= 700;
        // this.player2.loadTexture('player2');
        this.player2.animations.stop()
        this.player2.frame=1
      }
//    }
  },
  playerDuck: function() {
      console.log('duck 1',this.pressingDown);
//    if (n==1 || n==undefined) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('playerDuck');
        this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);

        //we use this to keep track whether it's ducked or not
        this.player.isDucked = true;
//      } else {
//        //change image and update the body size for the physics engine
//        this.player2.loadTexture('playerDuck2');
//        this.player2.body.setSize(this.player2.duckedDimensions.width, this.player2.duckedDimensions.height);
//
//        //we use this to keep track whether it's ducked or not
//        this.player2.isDucked = true;
//      }
  },
playerDuck2: function() {
//    if (n==1 || n==undefined) {
//        //change image and update the body size for the physics engine
//        this.player.loadTexture('playerDuck');
//        this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
//
//        //we use this to keep track whether it's ducked or not
//        this.player.isDucked = true;
//      } else {
        //change image and update the body size for the physics engine
        this.player2.loadTexture('playerDuck2');
        this.player2.body.setSize(this.player2.duckedDimensions.width, this.player2.duckedDimensions.height);

        //we use this to keep track whether it's ducked or not
        this.player2.isDucked = true;
//      }
  },
  render: function()
    {
//         this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Monaco");
//         this.game.debug.bodyInfo(this.dad, 0, 80);
    }
};
