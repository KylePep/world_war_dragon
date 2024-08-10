import { logger } from "../../../utils/Logger.js";
import { AppState } from "../../../AppState.js";

export class DragonAttack {
  constructor(scene, dragon) {
    // super(scene, dragon.x, dragon.y + 50); // Initialize the container below the dragon
    this.dragon = dragon
    this.dragonX = dragon.originalX
    this.dragonY = dragon.originalY

    this.scene = scene;
    this.attackInterval = 5000; // Time between attacks in milliseconds

    this.lastAttackTime = 0;

    this.dragonSounds = [
      `dragonAttack_1`,
      `dragonAttack_2`,
      `dragonAttack_3`,
      `dragonAttack_4`,
      `dragonAttack_5`,
    ]

    this.createBar();
  }

  createBar() {

    const { width, height } = this.scene.cameras.main;
    const barWidth = width / 2
    this.barColor = 0x8e22cf

    this.attackContainer = this.scene.add.container(this.dragonX, this.dragonY + height * .22)

    this.barBackground = this.scene.add.rectangle(0, 0, barWidth, 10, 0x000000).setOrigin(0.5, 1);

    this.attackBar = this.scene.add.rectangle(0, -2.5, barWidth - 10, 5, this.barColor).setOrigin(0.5, 1).setDepth(400);

    this.attackContainer.add(this.barBackground);
    this.attackContainer.add(this.attackBar);
  }

  startAttack() {
    this.scene.time.addEvent({
      delay: this.attackInterval,
      callback: this.attack,
      callbackScope: this,
      loop: true
    });
  }

  attack() {

    if (this.scene.dragon.dragonHP > 0 && this.scene.playerHp > 0) {


      if (this.scene.shield > 0) {

        this.scene.shield -= 1
        const selectedSound = 'shield_use'
        const sound = this.scene.sound.add(selectedSound)
        sound.play();
        sound.volume = 0.5;

        this.scene.screenEffect.playFlash(0x0081ff, 500);

      } else {

        const selectedSound = this.getRandomSound()
        const sound = this.scene.sound.add(selectedSound)
        sound.play();
        sound.volume = 0.5;

        this.scene.playerHp -= 10 * AppState.activeRoom.difficulty
        this.scene.playerUi.updatePlayerHp(this.scene.playerHp)

        this.checkPlayerDeath()

        this.scene.screenEffect.playFlash(0xFF0000, 500);
        this.scene.screenEffect.animateBite();

      }

    }


    this.lastAttackTime = this.scene.time.now; // Reset the timer for the next attack
  }

  checkPlayerDeath() {
    if (this.scene.playerHp <= 0) {
      this.scene.sound.stopAll()
      this.scene.events.off('dragon:hit')
      this.scene.events.off('dragon:over')
      this.scene.events.off('dragon:out')
      this.scene.events.off('dragon:attackItem')
      this.scene.playerHp = this.scene.playerMaxHp
      this.scene.scene.start('GameOver');
    }
  }

  getRandomSound() {
    return Phaser.Math.RND.pick(this.dragonSounds);
  }

  updateProgressBar() {
    if (this.scene.shield > 0) {
      this.barColor = 0x807a83
    } else {
      this.barColor = 0x8e22cf
    }
    this.attackBar.setFillStyle(this.barColor)
    const { width, height } = this.scene.cameras.main;
    const barWidth = width / 2

    if (this.lastAttackTime == 0) {
      this.lastAttackTime = this.scene.time.now
    }
    const elapsed = this.scene.time.now - this.lastAttackTime;
    let progress = elapsed / this.attackInterval;
    if (progress > 1) progress = 1

    this.attackBar.width = progress * (barWidth - 10);

  }

  update() {
    this.updateProgressBar();
  }

}