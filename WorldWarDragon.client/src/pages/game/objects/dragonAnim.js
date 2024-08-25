import { logger } from "../../../utils/Logger.js";
import { EventBus } from '../EventBus.js';

export class DragonAnim {
  constructor(dragon, scene) {
    this.dragonObj = dragon;
    this.dragon = dragon.dragon;
    this.scene = scene;
    this.scale = this.setScaleToFitWindow(0)

    this.setupAnimation();
  }

  setupAnimation() {
    this.entranceAnimation()
  }

  entranceAnimation() {

    this.dragon.setScale(0);

    const randomRate = Phaser.Math.FloatBetween(0.8, 1.2);
    const selectedSound = 'dragonEntrance'
    const sound = this.scene.sound.add(selectedSound)
    sound.play();
    sound.volume = .2;
    sound.rate = randomRate

    this.scene.tweens.add({
      targets: this.dragon,
      scaleX: (this.scale * 1.5), // Target scale for x-axis
      scaleY: (this.scale * 1.2), // Target scale for y-axis
      duration: 500, // Duration of the scaling animation in milliseconds
      ease: 'Power1',
      // yoyo: true,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.dragon,
          scaleX: (this.scale), // Target scale for x-axis
          scaleY: (this.scale), // Target scale for y-axis
          duration: 500, // Duration of the scaling animation in milliseconds
          ease: 'Power1',
          // yoyo: true,
          onComplete: () => {
            this.dragonObj.updateDragonAnimState('idle');
          }
        });
      }
    });

  }

  exitAnimation() {
    const { width, height } = this.scene.cameras.main

    this.copyDragon = this.scene.add.sprite(width / 2, height / 2, this.dragon.texture.key).setOrigin(0.5, 0.5)

    this.dragon.setAlpha(0)


    const randomRate = Phaser.Math.FloatBetween(0.8, 1.2);
    const selectedSound = 'dragonExit'
    const sound = this.scene.sound.add(selectedSound)
    sound.play();
    sound.volume = .75;
    sound.rate = randomRate
    this.scene.cameras.main.fadeOut(2000, 0, 0, 0);

    this.scene.tweens.add({
      targets: this.copyDragon,
      scaleX: 0, // Target scale for x-axis
      scaleY: 0, // Target scale for y-axis
      angle: 180,
      duration: 1000, // Duration of the scaling animation in milliseconds
      ease: 'Power1',
      onComplete: () => {
        this.dragonObj.updateDragonAnimState('exit');
        this.dragonObj.checkDeath()
      }
    });
  }

  setScaleToFitWindow(modifier) {
    const { width, height } = this.scene.cameras.main
    const dragonWidth = this.dragon.width
    const dragonHeight = this.dragon.height

    // const scaleX = width / dragonWidth
    const scaleY = height / dragonHeight

    const scale = scaleY * 0.5 + modifier;
    // const scale = Math.min(scaleX, scaleY) * 0.5 + modifier;
    return scale
  }

}