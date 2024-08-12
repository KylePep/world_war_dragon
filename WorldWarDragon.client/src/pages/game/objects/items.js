import { Scene } from 'phaser';
import { AppState } from "../../../AppState.js";
import { logger } from "../../../utils/Logger.js";
import { accountService } from "../../../services/AccountService.js";

export class Item {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.activeRoomId = AppState.activeRoom.id

    this.items = ['attack', 'shield', 'heal'];
    this.patterns = {
      attack: [0, 3, 1, 2],
      shield: [0, 3, 2, 1],
      heal: [0, 2, 1, 3],
    }
    this.action = 'input'
  }

  checkInputCode(inputCode) {
    if (this.action == 'input') {
      const inputCodeString = inputCode.join('');

      // Convert pattern arrays to strings for easy comparison
      const patterns = {
        attack: this.patterns.attack.join(''),
        attackAlt: this.patterns.attack.reverse().join(''),
        shield: this.patterns.shield.join(''),
        shieldAlt: this.patterns.shield.reverse().join(''),
        heal: this.patterns.heal.join(''),
        healAlt: this.patterns.heal.reverse().join('')
      };

      // Check if inputCode matches any pattern
      if (inputCodeString === patterns.attack || inputCodeString === patterns.attackAlt) {
        this.action = 'attack';
      } else if (inputCodeString === patterns.shield || inputCodeString === patterns.shieldAlt) {
        this.action = 'shield';
      } else if (inputCodeString === patterns.heal || inputCodeString === patterns.healAlt) {
        this.action = 'heal';
      }
    }

    logger.log('ACTION', this.action, 'CODE', this.inputCodeString, 'INPUT-CODE', inputCode);

    if (this.action != 'input') {
      if (this.activeRoomId == 6) {
        this.useItem();
      } else if (AppState.account[this.action] > 0 || AppState.account[`${this.action}Aid`] > 0) {
        if (AppState.account[`${this.action}Aid`] > 0) {
          AppState.account[`${this.action}Aid`] -= 1;
        } else {
          AppState.account[this.action] -= 1;
        }
        const accountData = AppState.account;
        accountService.editAccount(accountData);

        this.useItem();

      } else {
        AppState.account[this.action] = 0;
        AppState.account[`${this.action}Aid`] = 0;
        const accountData = AppState.account;
        accountService.editAccount(accountData);
      }

      this.action = 'input';
    }
    this.inputCode = [];
  }

  useItem() {

    if (this.action == 'attack') {
      this.scene.events.emit('dragon:attackItem')
      this.scene.playerUi.updateItem()
    } else if (this.action == 'shield') {
      this.scene.shield += 1;
      const selectedSound = 'shield_set'
      const sound = this.scene.sound.add(selectedSound)
      sound.play();
      sound.volume = 1;
      this.scene.dragonAttack.updateProgressBar();
      this.scene.playerUi.updateItem()
    } else if (this.action == 'heal') {
      const selectedSound = 'healItem'
      const sound = this.scene.sound.add(selectedSound)
      sound.play();
      sound.volume = .5;
      this.scene.playerHp = this.scene.playerMaxHp;
      this.scene.playerUi.updatePlayerHp(this.scene.playerHp)
      this.scene.playerUi.updateItem()

      this.scene.screenEffect.playFlash(0x00ff3a, 500);

    } else {
    }
  }

}