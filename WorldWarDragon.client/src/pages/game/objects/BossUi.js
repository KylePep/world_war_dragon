// BossUi
import { AppState } from "../../../AppState.js";
import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';

export class BossUi {
  constructor(scene, bossName, bossTitle, bossHp, maxHp) {
    this.scene = scene;
    this.bossName = bossName;
    this.bossTitle = bossTitle;
    this.bossHp = bossHp;
    this.maxHp = maxHp;

    this.createUI();
    this.setScaleToFitWindow();
    this.scene.scale.on('resize', this.setScaleToFitWindow, this);
  }

  createUI() {
    const { width, height } = this.scene.cameras.main;

    // Create the UI container
    this.bossUiContainer = this.scene.add.container(0, height);

    const barWidth = width;
    const barHeight = 80;
    const borderColor = 0xFFFFFF; // White color
    const borderThickness = 16; // Thickness of the border

    // Create the bottom bar
    this.bottomBar = this.scene.add.rectangle(width / 2, 0, barWidth, barHeight, 0x000000).setOrigin(0.5, 1)
    this.bottomBar.setInteractive();

    this.bottomBar.on('pointerover', () => {
      this.scene.input.setDefaultCursor('url(/assets/ui/cursor1.png), auto')
    });

    this.bottomBar.on('pointerout', () => {
      this.scene.input.setDefaultCursor('url(/assets/ui/cursor3.png), auto')
    });
    this.bossUiContainer.add(this.bottomBar);

    // Create a Graphics object for the border
    const bottomBarBorder = this.scene.add.graphics();
    bottomBarBorder.lineStyle(borderThickness, borderColor);

    // Draw the border around the top bar
    bottomBarBorder.strokeRectShape(new Phaser.Geom.Rectangle(width / 2 - barWidth / 2, -barHeight, barWidth, barHeight));

    this.bossUiContainer.addAt(bottomBarBorder, 0);

    // Add home button
    this.homeButton = this.scene.add.text(10, - 40, 'HOME', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: 'white',
      stroke: '#000000', strokeThickness: 8,
      align: 'left'
    }).setOrigin(0, 1).setDepth(400).setInteractive().on('pointerdown', () => {
      EventBus.emit('navigate-home');
    }).on('pointerover', () => this.buttonOver(this.homeButton)).on('pointerout', () => this.buttonOut(this.homeButton));
    this.bossUiContainer.add(this.homeButton);

    // Add Map button
    this.mapButton = this.scene.add.text(10, - 40, 'MAP', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: 'white',
      stroke: '#000000', strokeThickness: 8,
      align: 'left'
    }).setOrigin(0, 1).setDepth(400).setInteractive().on('pointerdown', () => {
      this.scene.sound.stopAll()
      this.scene.dragon.destroyEventListeners()
      this.scene.scene.start('Map');
    }).on('pointerover', () => this.buttonOver(this.mapButton)).on('pointerout', () => this.buttonOut(this.mapButton));
    this.bossUiContainer.add(this.mapButton);

    if (AppState.mode == 'multi' && AppState.activeRoom.id != 6) {   // Add Finish button
      this.finishButton = this.scene.add.text(10, - 40, 'Finish', {
        fontFamily: '"Press Start 2P"', fontSize: '16px', color: 'white',
        stroke: '#000000', strokeThickness: 8,
        align: 'left'
      }).setOrigin(1, 1).setDepth(400).setInteractive().on('pointerdown', () => {
        this.scene.sound.stopAll()
        this.scene.dragon.destroyEventListeners()
        this.scene.leaveRoom();
      }).on('pointerover', () => this.buttonOver(this.finishButton)).on('pointerout', () => this.buttonOut(this.finishButton));
      this.bossUiContainer.add(this.finishButton);
    }

    // Add boss name text
    this.bossNameText = this.scene.add.text(width / 2, - 40, this.bossName, {
      fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'left'
    }).setOrigin(0.5, 1).setDepth(400);
    this.bossUiContainer.add(this.bossNameText);

    // Add boss title text
    this.bossTitleText = this.scene.add.text(width / 2, - 20, this.bossTitle, {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'left'
    }).setOrigin(0.5, 1).setDepth(400);
    this.bossUiContainer.add(this.bossTitleText);

    // Add boss health bar
    this.healthBarBackground = this.scene.add.rectangle(10, - 10, width - 20, 10, 0x555555).setOrigin(0, 1);

    this.healthBar = this.scene.add.rectangle(10, - 10, (this.bossHp / this.maxHp) * (width - 20), 10, 0xff0000).setOrigin(0, 1).setDepth(400);

    this.bossUiContainer.add(this.healthBarBackground);
    this.bossUiContainer.add(this.healthBar);
  }

  setScaleToFitWindow() {
    const { width, height } = this.scene.cameras.main;

    const fontSize = width < 768 ? '10px' : '16px';
    const specialFontSize = width < 768 ? '16px' : '20px';

    this.homeButton.setFontSize(fontSize);
    this.mapButton.setFontSize(fontSize);
    if (AppState.mode == 'multi' && AppState.activeRoom.id != 6) {
      this.finishButton.setFontSize(fontSize);
    }
    this.bossNameText.setFontSize(specialFontSize);
    this.bossTitleText.setFontSize(fontSize);

    // Update the bottom bar width
    this.bottomBar.width = width;

    // Update health bar width and position
    this.healthBarBackground.width = width - 20;
    this.healthBar.width = (this.bossHp / this.maxHp) * (width - 20);

    // Reposition elements
    this.bottomBar.setPosition(width / 2, 0);
    this.homeButton.setPosition(10, - 40);
    this.mapButton.setPosition(width * .15, - 40);

    this.bossNameText.setPosition(width / 2, - 40);
    this.bossTitleText.setPosition(width / 2, - 20);
    this.healthBarBackground.setPosition(10, - 10);
    this.healthBar.setPosition(10, - 10);
    if (AppState.mode == 'multi' && AppState.activeRoom.id != 6) {
      this.finishButton.setPosition(width, - 40);
    }
  }

  buttonOver(button) {
    button.setColor('#ff7300');
    this.scene.input.setDefaultCursor('url(/assets/ui/cursor2.png), pointer')
  }
  buttonOut(button) {
    button.setColor('white');
    this.scene.input.setDefaultCursor('url(/assets/ui/cursor1.png), auto')
  }

  updateBossHp(newHp) {
    this.bossHp = newHp;
    const { width } = this.scene.cameras.main;
    this.healthBar.width = (this.bossHp / this.maxHp) * (width - 20);
  }
}