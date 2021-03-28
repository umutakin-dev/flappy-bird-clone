import Phaser from 'phaser';

const config = {
  // WebGL
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    // Arcade physics plugin manages physics simulation
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

// Loading assets, such as images, music, animation, ...
function preload() {
  // this context - scene
  // contains functions and properties we can use
  //debugger

  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird = null;
let totalDelta = null;

// Initialize Application
function create() {
  //debugger\
  // x - 400
  // y - 300
  // key of the image
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird').setOrigin(0, 0);

  //bird.body.gravity.y = 200;
}

// 60 fps
// 60 times per second
function update(time, delta) {

  totalDelta += delta;

  if (totalDelta < 1000) {
    return;
  }
  else if (totalDelta >= 1000) {
    console.log(bird.body.velocity.y);
    totalDelta = 0;
  }

}

new Phaser.Game(config);