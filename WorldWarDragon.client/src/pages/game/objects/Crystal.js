import { EventBus } from '../EventBus.js';
import { AppState } from "../../../AppState.js";
import { logger } from "../../../utils/Logger.js";

export class Crystal {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.inputCode = []
    this.interactiveObjects = [];
    this.lines = [];
    this.isDrawing = false;
    this.lineWidth = 5;

    this.neutralColor = 0xff7300
    this.attackColor = 0xff2f00
    this.healColor = 0x00ff06
    this.shieldColor = 0x0073ff

    this.crystalColor = this.neutralColor

    this.createInteractiveObjects();
  }

  createInteractiveObjects() {
    const { width, height } = this.scene.cameras.main;
    const items = (AppState.account.attack + AppState.account.attackAid + AppState.account.shield + AppState.account.shieldAid + AppState.account.heal + AppState.account.healAid)
    if (items > 0 || AppState.activeRoom.id == 6) {
      // Define margins based on screen size
      const smallScreenMargin = width * 0.125;
      const largeScreenMargin = width * 0.25;
      const leftRightMargin = width > 800 ? largeScreenMargin : smallScreenMargin;

      const positions = [
        { x: width / 2, y: 128, id: 0 }, // Top
        { x: width / 2, y: height - 128, id: 2 }, // Bottom
        { x: width - leftRightMargin, y: height / 2, id: 1 }, // Right
        { x: leftRightMargin, y: height / 2, id: 3 } // Left
      ];

      const FRAME_COUNT = 5;
      const FRAME_RATE = 6;
      if (!this.scene.anims.exists('playGif')) {
        this.scene.anims.create({
          key: 'playGif',
          frames: this.scene.anims.generateFrameNumbers('animatedCrystal', { start: 0, end: FRAME_COUNT - 1 }),
          frameRate: FRAME_RATE,
          repeat: -1 // Loop the animation
        });
      }

      // Floating tween parameters
      const FLOAT_DISTANCE = 3; // Distance in pixels for floating
      const FLOAT_DURATION = 2000; // Duration of the float cycle in millisecond

      positions.forEach((pos, index) => {
        const obj = this.scene.add.sprite(pos.x, pos.y, 'animatedCrystal')
          .setScale(1.5)
          .setInteractive()
          .setDepth(100);
        obj.id = pos.id; // Assign the ID to the object

        // Floating tween animation
        this.scene.tweens.add({
          targets: obj,
          y: obj.y - FLOAT_DISTANCE, // Move up by FLOAT_DISTANCE pixels
          duration: FLOAT_DURATION / 2, // Half of the total duration
          yoyo: true, // Make the tween return to the original position
          repeat: -1 // Repeat indefinitely
        });

        // Change color on hover
        obj.on('pointerover', () => {
          this.scene.input.setDefaultCursor('url(/assets/ui/cursor4.png) 16 16, pointer')
          if (this.isDrawing) {

            this.setInputCode(obj.id)
            obj.play('playGif')
            obj.setTint(this.crystalColor);
            this.addStaticLine(obj);
          }
        });

        obj.on('pointerout', () => {
          if (!this.isDrawing && this.inputCode.length == 0) {
            this.scene.input.setDefaultCursor('url(/assets/ui/cursor3.png), default')
            obj.setTint(0xffffff); // Default color
          }
        });

        // Change color on click and start drawing
        obj.on('pointerdown', (pointer) => {
          if (!this.isDrawing) {
            this.crystalColor = this.neutralColor
            this.startDrawing(obj.x, obj.y, obj);
            obj.setTint(this.crystalColor); // Clicked color
            this.inputCode.push(obj.id)
            obj.play('playGif')
          }
        });

        this.interactiveObjects.push(obj);
      });

      this.scene.input.on('pointermove', (pointer) => {
        if (this.isDrawing) {
          this.updateLine(pointer.x, pointer.y);
        }
      });

      this.scene.input.on('pointerup', (pointer) => {
        if (this.isDrawing) {
          this.cancelDrawing();
        }
      });
    }
  }

  startDrawing(x, y, obj) {
    if (this.inputCode.length >= 4) {
      this.stopDrawing(obj);
      return;
    }
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
    this.currentLine = this.scene.add.line(0, 0, x, y, x, y, this.crystalColor)
      .setOrigin(0, 0)
      .setDepth(100)
      .setLineWidth(this.lineWidth); // Set line width here
    this.lines.push(this.currentLine);
    this.startObject = obj;
  }

  updateLine(x, y) {
    if (this.currentLine) {
      const dx = x - this.startX;
      const dy = y - this.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Phaser.Math.Angle.Between(this.startX, this.startY, x, y);

      this.currentLine.setTo(this.startX, this.startY, this.startX + distance * Math.cos(angle), this.startY + distance * Math.sin(angle));
    }
  }

  addStaticLine(obj) {
    if (this.currentLine) {
      const line = this.currentLine;
      const dx = obj.x - this.startX;
      const dy = obj.y - this.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Phaser.Math.Angle.Between(this.startX, this.startY, obj.x, obj.y);

      line.setTo(this.startX, this.startY, this.startX + distance * Math.cos(angle), this.startY + distance * Math.sin(angle));
      line.setLineWidth(this.lineWidth); // Ensure line width is set

      if (this.inputCode.length < 4) {
        this.startDrawing(obj.x, obj.y, obj);
      } else {
        this.stopDrawing(obj);
      }
    }
  }

  stopDrawing(obj) {
    this.isDrawing = false;
    this.scene.input.setDefaultCursor('url(/assets/ui/cursor3.png), default')
    if (this.startObject !== obj) {
      const line = this.currentLine;
      if (line) {
        const dx = obj.x - this.startX;
        const dy = obj.y - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Phaser.Math.Angle.Between(this.startX, this.startY, obj.x, obj.y);

        line.setTo(this.startX, this.startY, this.startX + distance * Math.cos(angle), this.startY + distance * Math.sin(angle));
        line.setLineWidth(this.lineWidth); // Ensure line width is set

        // Logic for completing the action when all objects are connected can be added here
        this.scene.item.checkInputCode(this.inputCode)
        this.updateCrystalColor(this.scene.item.checkInput(this.inputCode))

        setTimeout(() => {
          this.cancelDrawing();
        }, 500);
      }
    } else {
      this.cancelDrawing();
    }
  }

  setInputCode(objId) {
    if (!this.inputCode.includes(objId)) {
      this.inputCode.push(objId)
    }
  }

  updateCrystalColor(newColor) {
    if (newColor == 'heal') {
      newColor = this.healColor
    } else if (newColor == 'attack') {
      newColor = this.attackColor
    } else if (newColor == 'shield') {
      newColor = this.shieldColor
    } else {
      newColor = this.neutralColor
    }
    this.crystalColor = newColor
    this.lines.forEach(line => {
      line.setStrokeStyle(this.lineWidth, this.crystalColor);
    });
    this.interactiveObjects.forEach(obj => {
      obj.setTint(newColor)
    });
  }

  cancelDrawing() {
    this.isDrawing = false;
    this.scene.input.setDefaultCursor('url(/assets/ui/cursor3.png), default')
    this.lines.forEach(line => line.destroy());
    this.lines = [];
    this.interactiveObjects.forEach(obj => {
      obj.setTint(0xffffff)
      obj.stop('playGif')
    });
    this.inputCode = [];
  }

}
