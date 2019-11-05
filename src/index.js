import { Game } from 'phaser'
import BootScene from './scenes/BootScene'
import ClickStart from './scenes/ClickStart'
import GameScene from './scenes/GameScene'

const config = {
  type: Phaser.WEBGL,
  parent: 'content',
  width: 480,
  height: 270,
  pixelArt: true,
  roundPixels: true,
  scene: [
    BootScene,
    ClickStart,
    GameScene
  ]
}

const game = new Phaser.Game(config)
