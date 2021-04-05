import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', config);

        this.menu = [
            {scene: null, text: `Best Score: ${localStorage.getItem('bestScore') || 0}`},
            {scene: 'MenuScene', text: 'Back'}
        ];
    }

    create() {
        super.create();

        this.createMenu(
            this.menu, 
            (menuItem) => this.setupMenuEvents(menuItem));
    }

    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        })

        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});
        })

        textGO.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);

            // if (menuItem.text === 'Exit') {
            //     this.scene.start('MenuScene');
            // }
        })
    }

}

export default ScoreScene;