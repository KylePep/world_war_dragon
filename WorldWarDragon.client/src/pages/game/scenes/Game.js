import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { useRouter } from "vue-router";
import { DRAGON_NAMES } from '../../../../../shared/constants/index.js'
import { DRAGON_TITLES } from '../../../../../shared/constants/index.js'
import { Dragon } from "../objects/dragon.js";
import { Slash } from "../objects/slash.js";
import { AppState } from "../../../AppState.js";
import { Item } from "../objects/items.js";
import { DragonAttack } from "../objects/dragonAttack.js";
import { logger } from "../../../utils/Logger.js";
import { BossUi } from "../objects/BossUi.js";
import { PlayerUi } from "../objects/PlayerUI.js";
import { ScreenEffect } from "../objects/ScreenEffect.js";
import { Crystal } from "../objects/Crystal.js";

export class Game extends Scene {
    constructor() {
        super('Game');
        this.router = useRouter()

        this.timerInterval = 1000;


    }

    create() {
        this.input.setDefaultCursor('url(/assets/ui/cursor3.png), auto')

        this.cameras.main.fadeIn(250, 0, 0, 0)

        this.timerEvent = this.time.addEvent({
            delay: this.timerInterval,
            callback: this.onTimerEvent,
            callbackScope: this,
            loop: true
        });

        this.activeRoomId = AppState.activeRoom.id
        if (this.activeRoomId && this.activeRoomId != 5 && this.activeRoomId != 6) {
            this.playerMaxHp = AppState.account.health + AppState.healthMod[this.activeRoomId]
        } else {
            this.playerMaxHp = AppState.account.health
        }
        if (AppState.mode != 'multi') {
            this.playerHp = this.playerMaxHp
            AppState.health = this.playerHp
        } else {
            if (AppState.winStreak > 0) {
                logger.log('[HEALTH]', AppState.health)
                this.playerHp = AppState.health
            } else {
                this.playerHp = this.playerMaxHp
                AppState.health = this.playerHp
            }
        }

        this.shield = 0;

        const dragonNames = DRAGON_NAMES.find((data) => data.id === this.activeRoomId);
        const dragonTitles = DRAGON_TITLES.find((data) => data.id === this.activeRoomId);
        const backGrounds = ['beachBG', 'forestBG', 'mountainBG', 'cliffBG', 'islandBG', 'islandBG']



        // Randomly select a name and title
        const randomName = Phaser.Math.RND.pick(dragonNames.names);
        const randomTitle = Phaser.Math.RND.pick(dragonTitles.titles);

        this.cameras.main.setBackgroundColor(0xFFA500);

        this.background = this.add.image(0, 0, backGrounds[AppState.activeRoom.id - 1])
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);



        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.screenEffect = new ScreenEffect(this)

        this.dragon = new Dragon(this, centerX, centerY)

        this.bossUi = new BossUi(this, randomName, randomTitle, this.dragon.dragonHP, this.dragon.dragonHPMax)

        this.playerUi = new PlayerUi(this, AppState.account, this.playerHp, this.playerMaxHp)

        this.crystals = new Crystal(this, centerX, centerY)
        this.item = new Item(this, centerX, centerY);


        this.dragonAttack = new DragonAttack(this, this.dragon);
        this.dragonAttack.startAttack();

        this.slash = new Slash(this, centerX, centerY)

        this.scale.on('resize', this.resize, this);
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit('current-scene-ready', this);
    }

    onTimerEvent() {
        // Actions to perform on each timer tick
        // For example, you can call a function on the dragon object
        if (this.dragon) {
            this.dragonAttack.update();
        }
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.resize(width, height);

        this.background.setDisplaySize(width, height);
    }

    leaveRoom() {
        this.sound.stopAll()
        this.scene.start('GameResults')
        this.playerHp = this.playerMaxHp
        AppState.health = this.playerHp;
    }

    changeScene() {
        this.scene.start('GameOver');
        this.playerHp = this.playerMaxHp
    }

    restartGame() {
        logger.log('[RESTART GAME]', AppState.health, this.playerHp)
        AppState.health = this.playerHp;
        this.scene.start('Game')
    }

    update() {
        this.dragonAttack.update();
    }
}
