import { EventBus } from '../EventBus.js';

export class DragonAnim {
  constructor(dragon, animState, scene) {
    this.dragon = dragon;
    this.animState = animState;
    this.scene = scene;
    this.scale = this.setScaleToFitWindow(0)

    this.setupAnimation();
  }

  setupAnimation() {
    if (this.animState == 'entrance') {
      this.dragon.setScale(0);
      this.scene.tweens.add({
        targets: this.dragon,
        scaleX: this.scale, // Target scale for x-axis
        scaleY: this.scale, // Target scale for y-axis
        duration: 1000, // Duration of the scaling animation in milliseconds
        ease: 'Power1',
        onComplete: () => {
          this.animState = 'idle';
        }
      });
    }
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