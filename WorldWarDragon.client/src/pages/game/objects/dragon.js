import { logger } from "../../../utils/Logger.js";
import { AppState } from "../../../AppState.js";
import { AREA_DRAGONS } from '../../../../../shared/constants/index.js'
import { DragonAnim } from "./dragonAnim.js";

export class Dragon {
  constructor(scene, x, y) {
    this.scene = scene;
    this.activeRoomId = AppState.activeRoom.id
    this.dragonHP = this.getRandomDragonHP();
    this.dragonHPMax = this.dragonHP
    this.dragonAnimState = 'entrance' //entrance idle exiting exit
    this.bossDamage = Phaser.Math.RoundTo((.1 * this.dragonHP), 0);

    if (this.activeRoomId && this.activeRoomId != 5 && this.activeRoomId != 6) {
      this.goldMod = AppState.goldMod[this.activeRoomId]
    } else {
      this.goldMod = 0
    }
    this.modifier = Phaser.Math.RND.pick([1.1, .9])
    this.gold = Phaser.Math.RoundTo((this.bossDamage + this.goldMod * this.modifier), 0)
    this.valor = Phaser.Math.RoundTo((this.bossDamage * 0.1), 0)

    this.dragon = this.scene.add.sprite(x, y, this.getRandomDragonSprite()).setOrigin(0.5, 1)
    this.setScaleToFitWindow(0);
    this.setPositionToFitWindow();
    this.scene.scale.on('resize', this.setScaleToFitWindow, this)

    this.originalX = this.dragon.x;
    this.originalY = this.dragon.y;
    this.originalAngle = 0;

    this.dragon.setInteractive()
    this.addInteractions()
    this.setupDragonAnim()
    this.setupEventListeners();
  }

  setScaleToFitWindow(modifier) {
    const { width, height } = this.scene.cameras.main
    const dragonWidth = this.dragon.width
    const dragonHeight = this.dragon.height

    // const scaleX = width / dragonWidth
    const scaleY = height / dragonHeight

    const scale = scaleY * 0.5 + modifier;
    // const scale = Math.min(scaleX, scaleY) * 0.5 + modifier;
    this.dragon.setScale(scale)
  }
  setPositionToFitWindow() {
    const { width, height } = this.scene.cameras.main
    this.dragon.setPosition(width / 2, height / 2 + (this.dragon.displayHeight / 2))
  }

  setOriginCoordinates() {
    const { width, height } = this.scene.cameras.main
    this.originalX = width / 2
    this.originalY = height / 2
    this.dragon.setPosition(width / 2, height / 2)
    this.dragon.setOrigin(0.5, 0.5)
  }
  getRandomDragonHP() {
    logger.log('[ActiveRoomId]', this.activeRoomId, AppState.activeRoom)
    if (this.activeRoomId != 6) {
      const minHP = 45; // 100 / 10
      const maxHP = 100; // 1000 / 10
      return Phaser.Math.Between(minHP, maxHP) * (1 + (AppState.activeRoom.difficulty * AppState.activeRoom.difficulty));
    } else {
      return 1000000000
    }
  }

  getRandomDragonSprite() {
    const activeRoom = this.activeRoomId
    const areaDragons = AREA_DRAGONS.find((data) => data.id == activeRoom)
    const quantityMax = areaDragons.number
    const randomIndex = Phaser.Math.Between(1, quantityMax);
    return `${activeRoom}_dragon_${randomIndex}`
  }

  getRandomDragonSound() {
    const dragonSounds = ['swish_2', 'swish_3', 'swish_4'];
    return Phaser.Math.RND.pick(dragonSounds);
  }

  addInteractions() {

    this.dragon.on('pointerover', () => {
      this.onPointerOver()
    });

    this.dragon.on('pointerout', () => {
      this.onPointerOut()
    });
  }

  setupEventListeners() {
    this.scene.events.on('dragon:hit', this.onDragonHit, this);
    this.scene.events.on('dragon:over', this.onPointerOver, this);
    this.scene.events.on('dragon:out', this.onPointerOut, this);
    this.scene.events.on('dragon:attackItem', this.onAttackItem, this);
  }
  destroyEventListeners() {
    this.scene.events.off('dragon:hit')
    this.scene.events.off('dragon:over')
    this.scene.events.off('dragon:out')
    this.scene.events.off('dragon:attackItem')
  }

  checkDeath() {
    if (this.dragonHP <= 0) {
      this.dragonHp = 0

      if (this.dragonAnimState != 'exiting' && this.dragonAnimState != 'exit') {
        this.dragonAnimState = 'exiting'
        this.dragonAnim.exitAnimation()
      }


      if (this.dragonAnimState == 'exit') {
        AppState.bossDamage += this.bossDamage
        AppState.winStreak++
        AppState.account.dragons += 1

        AppState.gold += Phaser.Math.RoundTo(this.gold + (this.gold * (AppState.winStreak * .025)), 0)
        AppState.valor += Phaser.Math.RoundTo(this.valor + (this.valor * (AppState.winStreak * .025)), 0)


        this.destroyEventListeners()

        if (AppState.mode == 'single') {
          this.scene.leaveRoom()
        } else {
          this.scene.restartGame();
        }
      }


    }
  }

  onAttackItem() {
    const selectedSound = 'attackItem'
    const sound = this.scene.sound.add(selectedSound)
    sound.play();
    sound.volume = .25;

    if (this.activeRoomId != 6) {
      this.dragonHP = Phaser.Math.RoundTo((this.dragonHP / 2), 0);
      this.scene.bossUi.updateBossHp(this.dragonHP)
    }

    this.checkDeath()

    this.scene.tweens.add({
      // Shake effect
      targets: this.dragon,
      duration: 300, // Duration of the shake in milliseconds
      ease: 'Power1',
      x: this.dragon.x + Phaser.Math.RND.between(-16, 16), // Random X offset
      y: this.dragon.y + Phaser.Math.RND.between(-16, 16), // Random Y offset
      angle: this.dragon.angle + Phaser.Math.RND.between(-16, 16),
      yoyo: true, // Yoyo back to original position
      repeat: 0, // Number of times to repeat (0 means no repeat, just once)
      onStart: () => {
        this.dragon.setTint(0xff0000); // Turn red at the start of the tween
      },
      onComplete: () => {
        // Reset to original values
        this.dragon.x = this.originalX;
        this.dragon.y = this.originalY;
        this.dragon.angle = this.originalAngle;
        this.dragon.clearTint(); // Reset tint to default color
      }
    });
  }
  onDragonHit() {

    if (this.dragonAnimState == 'idle') {

      this.dragonHP -= AppState.account.power + (AppState.powerMod[AppState.activeRoom.id] || 0)

      this.scene.bossUi.updateBossHp(this.dragonHP)

      this.checkDeath()

      const selectedSound = this.getRandomDragonSound()
      const sound = this.scene.sound.add(selectedSound)
      sound.play();
      sound.volume = 0.2;
      if (!this.shakeTween || !this.shakeTween.isPlaying()) {

        this.shakeTween = this.scene.tweens.add({

          // Shake effect
          targets: this.dragon,
          duration: 100, // Duration of the shake in milliseconds
          ease: 'Power1',
          x: this.dragon.x + Phaser.Math.RND.between(-16, 16), // Random X offset
          y: this.dragon.y + Phaser.Math.RND.between(-16, 16), // Random Y offset
          angle: this.dragon.angle + Phaser.Math.RND.between(-16, 16),
          yoyo: true, // Yoyo back to original position
          repeat: 0,
          onComplete: () => {
            this.dragon.x = this.originalX;
            this.dragon.y = this.originalY;
            this.dragon.angle = this.originalAngle;
          }
        });

      }
    } else if (this.dragonAnimState == 'exiting') {
      this.shakeTween.stop(0)
      this.setOriginCoordinates()
    }
  }

  setupDragonAnim() {
    this.dragonAnim = new DragonAnim(this, this.scene)
  }

  updateDragonAnimState(newState) {
    this.dragonAnimState = newState
  }

  onPointerOver() {
    this.scene.input.setDefaultCursor('pointer');
  }

  onPointerOut() {
    this.scene.input.setDefaultCursor('default');
  }



}