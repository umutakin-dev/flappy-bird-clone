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
let pipes = null;

let pipeHorizontalDistance = 0;

const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [500, 550];

function preload() {

  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');

}

function create() {

  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = 
    this.physics.add.sprite(
      STARTING_POSITION.X, 
      STARTING_POSITION.Y, 
      'bird')
    .setOrigin(0, 0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group();
  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);

}

function update() {

  if (bird.y + bird.height > config.height || bird.y < 0) {
    restartBirdPosition();
  }

  recyclePipes();

}

function placePipe(uPipe, lPipe) {

  const rightmostX = getRightMostPipe();

  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);
  let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
  
  uPipe.x = rightmostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right < 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}

// function recyclePipes() {

//   let upperPipe = null;
//   let lowerPipe = null;

//   pipes.getChildren().forEach(pipe => {
//     if (pipe.getBounds().right < 0) {
//       if (upperPipe === null) {
//         upperPipe = pipe;
//       }
//       else {
//         lowerPipe = pipe;
//       }
//     }
//   })

//   if (upperPipe !== null || lowerPipe !== null) {
//     placePipe(upperPipe, lowerPipe);
//   }

// }

function getRightMostPipe() {

  let rightmostX = 0;
  
  pipes.getChildren().forEach(function(pipe) {
    rightmostX = Math.max(pipe.x, rightmostX);
  });

  return rightmostX;

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