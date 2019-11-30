import { Scene } from 'phaser'

class ClickStart extends Scene {
  constructor () {
    super({ key: 'ClickStart' })
  }

  create () {
    this.add.bitmapText(8, 4, 'font', 'click screen to enable keyboard and audio', 16)

    this.start = false

    this.cameras.main.setBackgroundColor('#343434')
  }

  update () {
    if (this.start) {
      return
    }

    if (this.input.activePointer.isDown) {
      this.start = true
      this.scene.start('TitleScene')
    }
  }
}

export default ClickStart
