import { EventBus } from '../EventBus.js';

export class ScreenEffect {
  constructor(scene) {
    this.scene = scene;

    this.createEffect();
  }

  createEffect() {

  }

  playFlash(color, duration) {
    const flash = this.scene.add.graphics();
    flash.fillStyle(color, 0.35); // Red color with 50% transparency
    flash.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: duration,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        flash.destroy();
      }
    });
  }

  animateBite() {
    const { width, height } = this.scene.cameras.main;

    const FRAME_COUNT = 5;
    const FRAME_RATE = 30;

    // Check if the animation already exists before creating it
    if (!this.scene.anims.exists('animatedBite')) {
      this.scene.anims.create({
        key: 'animatedBite',
        frames: this.scene.anims.generateFrameNumbers('animatedBite', { start: 0, end: FRAME_COUNT - 1 }),
        frameRate: FRAME_RATE,
        repeat: 0 // Play the animation once
      });
    }

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