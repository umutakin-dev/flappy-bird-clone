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
      debug: true,
      gravity: {
        y: 400
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

const STARTING_POSITION_X = config.width / 10;
const STARTING_POSITION_Y = config.height / 2;
const VELOCITY = 200;
const VELOCITY_FLAP = 300;

let bird = null;
let totalDelta = null;

// Initialize Application
function create() {

  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = this.physics.add.sprite(STARTING_POSITION_X, STARTING_POSITION_Y, 'bird').setOrigin(0, 0);

  this.input.on('pointerdown', flap);

  this.input.keyboard.on('keydown-SPACE', flap);

}

function flap() {
  bird.body.velocity.y = -VELOCITY_FLAP;
}

function update(time, delta) {

}

new Phaser.Game(config);