import { Scene } from 'phaser'

class ClickStart extends Scene {
  constructor () {
    super({ key: 'ClickStart' })
  }
  
  create () {
    this.add.bitmapText(20, 20, 'font', 'click screen to enable keyboard and audio')

    this.start = false
  }

  update () {
    // prevent switching problems, maybe not needed
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
