var SideScroller = SideScroller || {};

SideScroller.game = new Phaser.Game(790, 420, Phaser.AUTO, '');

SideScroller.game.state.add('Boot', SideScroller.Boot);
SideScroller.game.state.add('Preload', SideScroller.Preload);
SideScroller.game.state.add('Game', SideScroller.Game);

SideScroller.game.state.start('Boot');

//    var swipeCoordX,
//        swipeCoordY,
//        swipeCoordX2,
//        swipeCoordY2,
//        swipeMinDistance = 100;
//
//    game.input.onDown.add(function(pointer) {
////        swipeCoordX = pointer.clientX;
////        swipeCoordY = pointer.clientY;    
//    }, this);
//
//    game.input.onUp.add(function(pointer) {
////        swipeCoordX2 = pointer.clientX;
////        swipeCoordY2 = pointer.clientY;
////        if(swipeCoordX2 < swipeCoordX - swipeMinDistance){
////            console.log("left");
////        }else if(swipeCoordX2 > swipeCoordX + swipeMinDistance){
////            console.log("right");
////        }else if(swipeCoordY2 < swipeCoordY - swipeMinDistance){
////            console.log("up");
////        }else if(swipeCoordY2 > swipeCoordY + swipeMinDistance){
////            console.log("down");
////        }
//    }, this);   