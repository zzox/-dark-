import { Game, WEBGL } from 'phaser'
import BootScene from './scenes/BootScene'
import ClickStart from './scenes/ClickStart'
import GameScene from './scenes/GameScene'

const config = {
  type: WEBGL,
  parent: 'content',
  width: 320,
  height: 180,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      tileBias: 12,
      gravity: { y: 800 }
    }
  },
  scene: [
    BootScene,
    ClickStart,
    GameScene
  ]
}

const game = new Game(config)
