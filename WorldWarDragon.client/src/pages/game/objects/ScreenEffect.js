import { EventBus } from '../EventBus.js';

export class ScreenEffect {
  constructor(scene) {
    this.scene = scene;

    this.createEffect();
  }

  createEffect() {

  }

  redFlash() {
    const redFlash = this.scene.add.graphics();
    redFlash.fillStyle(0xFF0000, 0.25); // Red color with 50% transparency
    redFlash.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

    this.scene.tweens.add({
      targets: redFlash,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        redFlash.destroy();
      }
    });
  }
  blueFlash() {
    const blueFlash = this.scene.add.graphics();
    blueFlash.fillStyle(0x0081ff, 0.25); // Red color with 50% transparency
    blueFlash.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

    this.scene.tweens.add({
      targets: blueFlash,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        blueFlash.destroy();
      }
    });
  }
  greenFlash() {
    const greenFlash = this.scene.add.graphics();
    greenFlash.fillStyle(0x00ff3a, 0.25); // Red color with 50% transparency
    greenFlash.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

    this.scene.tweens.add({
      targets: greenFlash,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        greenFlash.destroy();
      }
    });
  }

  animateBite() {
    const { width, height } = this.scene.cameras.main;

    const FRAME_COUNT = 5;
    const FRAME_RATE = 30;

    this.scene.anims.create({
      key: 'animatedBite',
      frames: this.scene.anims.generateFrameNumbers('animatedBite', { start: 0, end: FRAME_COUNT - 1 }),
      frameRate: FRAME_RATE,
      repeat: 0 // Loop the animation
    });

    const randomAngle = Phaser.Math.Between(-45, 45);

    const biteSprite = this.scene.add.sprite(width / 2, height / 2, 'animatedBite')
      .setScale(30) // Adjust the scale as needed
      .setAngle(randomAngle)
      .setDepth(9999); // Ensure it's on top

    biteSprite.play('animatedBite');


    biteSprite.on('animationcomplete', () => {
      biteSprite.destroy(); // Remove the bite sprite after the animation is complete
    });
  }
}