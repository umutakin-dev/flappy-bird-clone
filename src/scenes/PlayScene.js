import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;

        this.pipeHorizontalDistance = 0;

        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 550];

        this.flapVelocity = 300;
    }

    preload() {

        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');

    }

    create() {

        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.handleInputs();

    }

    update() {

        this.checkGameStatus();
        
        this.recyclePipes();

    }

    createBG() {

        this.add.image(0, 0, 'sky').setOrigin(0, 0);

    }

    createBird() {

        this.bird = 
          this.physics.add.sprite(
            this.config.startPosition.x, 
            this.config.startPosition.y, 
            'bird')
          .setOrigin(0, 0);

        this.bird.body.gravity.y = 600;

        this.bird.setCollideWorldBounds(true);

    }

    createPipes() {

        this.pipes = this.physics.add.group();
        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            const upperPipe = 
                this.pipes
                    .create(0, 0, 'pipe')
                    .setImmovable(true)
                    .setOrigin(0, 1);
            const lowerPipe = 
                this.pipes
                    .create(0, 0, 'pipe')
                    .setImmovable(true)
                    .setOrigin(0, 0);

            this.placePipe(upperPipe, lowerPipe);
        }

        this.pipes.setVelocityX(-200);

    }

    createColliders() {

        this.physics.add.collider(
            this.bird, 
            this.pipes, 
            this.gameOver, 
            null, 
            this);

    }

    handleInputs() {

        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);

    }

    checkGameStatus() {
        
        if (this.bird.y <= 0 || 
            //this.bird.y >= this.config.height - this.bird.height ) {
            this.bird.getBounds().bottom >= this.config.height ) {
                this.gameOver();
        }

    }

    placePipe(uPipe, lPipe) {

        const rightmostX = this.getRightMostPipe();
        
        let pipeVerticalDistance   = 
          Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        let pipeVerticalPosition   = 
          Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
        let pipeHorizontalDistance = 
          Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
        
        uPipe.x = rightmostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
        
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;

    }
      
    recyclePipes() {

        const tempPipes = [];
        
        this.pipes.getChildren().forEach(pipe => {
          
          if (pipe.getBounds().right < 0) {
            tempPipes.push(pipe);
            
            if (tempPipes.length === 2) {
              this.placePipe(...tempPipes);
            }
          }
        })

    }

    getRightMostPipe() {

        let rightmostX = 0;
        
        this.pipes.getChildren().forEach(function(pipe) {
            rightmostX = Math.max(pipe.x, rightmostX);
        });
        
        return rightmostX;
        
    }
      
    gameOver() {
      
        // this.bird.x = this.config.startPosition.x;
        // this.bird.y = this.config.startPosition.y;
        
        // this.bird.body.velocity.y = 0;

        this.physics.pause();

        this.bird.setTint(0xff0000);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })

    }
      
    flap() {

        this.bird.body.velocity.y = -this.flapVelocity;

    }

}

export default PlayScene;