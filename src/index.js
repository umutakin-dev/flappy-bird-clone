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
      // gravity: {
      //   y: 400
      // }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const STARTING_POSITION = {
  X: config.width / 10,
  Y: config.height / 2
}
const VELOCITY = 200;
const VELOCITY_FLAP = 300;
const PIPES_TO_RENDER = 4;

let bird = null;
let upperPipe = null;
let lowerPipe = null;

let pipeHorizontalDistance = 0;

const pipeVerticalDistanceRange = [150, 250];

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

// Initialize Application
function create() {

  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = this.physics.add.sprite(STARTING_POSITION.X, STARTING_POSITION.Y, 'bird').setOrigin(0, 0);
  bird.body.gravity.y = 400;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    pipeHorizontalDistance += 400;
    let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);
    upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalPosition, 'pipe').setOrigin(0, 1);
    lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0);

    upperPipe.body.velocity.x = lowerPipe.body.velocity.x = -200;
  }

  //drawPipe(this, 300, 200);
  //drawPipe(this, 500, 150);

  //this.add.image(200, 0, 'pipe').setOrigin(0, 0);

  //pipe = this.physics.add.sprite(STARTING_POSITION.X, STARTING_POSITION.Y, 'pipe');

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);

}

// function drawPipe(canvas, x, y) {
//   // canvas.physics.add.sprite(x, y - 575, 'pipe').setOrigin(0, 0);
//   // canvas.physics.add.sprite(x, y + 25, 'pipe').setOrigin(0, 0);
//   // pipe = this.physics.add.sprite(300, 100, 'pipe').setOrigin(0, 0);

//   // upper pipe
//   canvas.physics.add.sprite(x, y, 'pipe').setOrigin(0, 1);
//   // lower pipe
//   canvas.physics.add.sprite(x, y + 100, 'pipe').setOrigin(0, 0);
// }

// if bird y position is small than 0 or greater than height of the canvas
// the alert "you have lost"
function update() {
  if (bird.y + bird.height > config.height || bird.y < 0) {
    restartBirdPosition();
  }
}

function restartBirdPosition() {
  bird.x = STARTING_POSITION.X;
  bird.y = STARTING_POSITION.Y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -VELOCITY_FLAP;
}

new Phaser.Game(config);