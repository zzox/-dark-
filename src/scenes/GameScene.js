import { Scene, Input } from 'phaser'

const TEXT_SIZE = 16

class GameScene extends Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    this.add.bitmapText(20, 20, 'font', 'we here' , TEXT_SIZE)
  }
}

export default GameScene
