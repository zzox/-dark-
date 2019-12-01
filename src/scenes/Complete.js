import { Scene, Input } from 'phaser'
import BackgroundGfx from '../gameobjects/BackgroundGfx'

class Complete extends Scene {
  constructor () {
    super({ key: 'Complete' })
  }

  create () {
    const { ENTER } = Input.Keyboard.KeyCodes
    this.cameras.main.setBackgroundColor('#0d2030')

    this.bgGfx = new BackgroundGfx({ scene: this })

    this.add.bitmapText(46, 20, 'font', 'Thank you for playing : : dark : :', 16)
    this.add.bitmapText(20, 40, 'font', 'Follow me @zzo__x, I\'d love to hear your', 16)
    this.add.bitmapText(130, 60, 'font', 'thoughts', 16)
    this.add.bitmapText(146, 85, 'font', 'Quit', 16)

    this.spr = this.add.sprite(130, 90, 'life')

    this.prevState = {
      startKey: true,
      upKey: true,
      downKey: true
    }

    this.startKey = this.input.keyboard.addKey(ENTER)

    this.cameras.main.fadeIn(2000)

    this.music = this.sound.playAudioSprite('songs', 'dark-two', { loop: true })
  }

  update () {
    if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2) {
      this.pauseMusic()
      this.quit()
    }

    this.spr.y = this.menuPos * 20 + 70

    this.prevState = {
      startKey: this.startKey.isDown
    }

    this.bgGfx.update()
  }

  quit () {
    this.scene.start('TitleScene')
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].key === 'soundtrack') {
        this.sound.sounds[i].pause()
      }
    }
  }
}

export default Complete
