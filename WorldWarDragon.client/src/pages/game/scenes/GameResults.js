import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { bossService } from "../../../services/BossService.js";
import { AppState } from "../../../AppState.js";
import Pop from "../../../utils/Pop.js";
import { accountService } from "../../../services/AccountService.js";
import { logger } from "../../../utils/Logger.js";
import { bossDamageService } from "../../../services/BossDamageService.js";

export class GameResults extends Scene {
    constructor() {
        super('GameResults');
    }

    create() {
        // Create and play the background music
        this.backgroundMusic = this.sound.add('victoryBGM', {
            volume: 0.1, // Adjust the volume
            loop: false   // Loop the music
        });

        this.backgroundMusic.play();
        this.getBossData();
        this.cameras.main.setBackgroundColor(0xff4500);

        this.background = this.add.image(0, 0, 'darkDragonBG')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.updateBossHP();


        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.rewardItems = { attack: 0, shield: 0, heal: 0 };

        this.title = this.add.text(centerX, centerY - 200, `${AppState.bossDamage} Damage dealt to \n ${AppState.activeBoss.name}`, {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const newBossHp = AppState.activeBoss.hp - AppState.activeBoss.damages - AppState.bossDamage;

        this.bossHp = this.add.text(centerX, centerY - 100, `${newBossHp} Hp remains`, {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.rewards = this.add.text(centerX, centerY, `+${AppState.gold} Gold | +${AppState.valor} EXP \n Attack: ${this.rewardItems.attack} | Shield: ${this.rewardItems.shield} | Heal: ${this.rewardItems.heal}`, {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.fight = this.add.text(centerX, centerY + 100, `FIGHT! | ${AppState.winStreak} : Streak`, {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive().on('pointerover', () => this.buttonOver(this.fight)).on('pointerout', () => this.buttonOut(this.fight));

        this.fight.on('pointerdown', () => {
            this.sound.stopAll()

            this.backgroundMusic = this.sound.add('DragonKingDungeon', {
                volume: 0.5, // Adjust the volume
                loop: true   // Loop the music
            });

            this.backgroundMusic.play();
            this.scene.start('Game')
        });

        this.map = this.add.text(centerX, centerY + 200, 'Map', {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive().on('pointerover', () => this.buttonOver(this.map)).on('pointerout', () => this.buttonOut(this.map));

        this.map.on('pointerdown', () => {
            this.sound.stopAll()
            this.scene.start('Map');
        });

        this.return = this.add.text(centerX, centerY + 300, 'RETREAT...', {
            fontFamily: '"Press Start 2P"', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive().on('pointerover', () => this.buttonOver(this.return)).on('pointerout', () => this.buttonOut(this.return));

        this.return.on('pointerdown', () => {
            EventBus.emit('navigate-home');
        });

        this.resize();
        this.updateAccount();
        this.resetGame();
        EventBus.emit('current-scene-ready', this);
    }

    buttonOver(button) {
        button.setColor('#ff7300');
        this.input.setDefaultCursor('pointer');
    }
    buttonOut(button) {
        button.setColor('white');
        this.input.setDefaultCursor('default');
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        const { width, height } = this.cameras.main;

        this.background.setDisplaySize(width, height);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.title.setPosition(centerX, centerY - 200);
        this.bossHp.setPosition(centerX, centerY - 100);
        this.rewards.setPosition(centerX, centerY);
        this.fight.setPosition(centerX, height * .60);
        this.map.setPosition(centerX, height * .70);
        this.return.setPosition(centerX, height * .80);


        this.adjustTextSize();
    }

    setFontToFitWindow() {
        const { width, height } = this.cameras.main;
        const baseFontSize = 32;
        const scaleFactor = Math.min(width / 1200, height / 800);
        return baseFontSize * scaleFactor;
    }

    adjustTextSize() {
        const newFontSize = `${this.setFontToFitWindow()}px`;

        this.title.setStyle({ fontSize: newFontSize });
        this.bossHp.setStyle({ fontSize: newFontSize });
        this.rewards.setStyle({ fontSize: newFontSize });
        if (AppState.mode != 'multi') {
            this.fight.setStyle({ fontSize: newFontSize });
        }
        this.map.setStyle({ fontSize: newFontSize });
        this.return.setStyle({ fontSize: newFontSize });
    }

    getBossData() {
        bossService.getBosses();
    }

    lootTable() {
        const difficulty = AppState.activeRoom.difficulty;
        const baseChance = difficulty / 100;

        if (this.activeRoomId && this.activeRoomId != 5) {
            this.luckMod = AppState.luckMod[this.activeRoomId]
        } else {
            this.luckMod = 0
        }
        const changeLuckMod = baseChance + (this.luckMod) * .1
        const items = ['attack', 'shield', 'heal'];

        if (AppState.mode != 'multi') {
            items.forEach(item => {
                if (Math.random() < changeLuckMod) {
                    this.rewardItems[item]++;
                }
            });
        } else {
            for (let i = 0; i < AppState.winStreak; i++) {
                items.forEach(item => {
                    if (Math.random() < changeLuckMod) {
                        this.rewardItems[item]++;
                    }
                });

            }

        }


        this.rewards.setText(`+${AppState.gold} Gold | +${AppState.valor} EXP \n Attack: ${this.rewardItems.attack} | Shield: ${this.rewardItems.shield} | Heal: ${this.rewardItems.heal}`);
    }

    async updateAccount() {
        try {
            this.lootTable();
            const accountData = {
                gold: AppState.account.gold + AppState.gold,
                valor: AppState.account.valor + AppState.valor,
                attack: AppState.account.attack + this.rewardItems.attack,
                shield: AppState.account.shield + this.rewardItems.shield,
                heal: AppState.account.heal + this.rewardItems.heal,
                dragons: AppState.account.dragons
            };
            await accountService.editAccount(accountData);
        } catch (error) {
            Pop.error(error.message, '[UPDATE ACCOUNT - GAME RESULT]');
        }
    }

    resetGame() {
        AppState.gold = 0;
        AppState.valor = 0;
        AppState.bossDamage = 0;
        if (AppState.mode == 'multi') {
            AppState.winStreak = 0
        }
    }

    async updateBossHP() {
        try {
            const bossDamageData = {
                dmg: AppState.bossDamage,
                bossId: AppState.activeBoss.id
            };
            await bossDamageService.createOrIncreaseBossDamage(bossDamageData);
        } catch (error) {
            Pop.error(error.message, '[]');
        }
    }
}
