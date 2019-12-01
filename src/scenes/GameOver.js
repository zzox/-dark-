import { Scene, Input } from 'phaser'
import BackgroundGfx from '../gameobjects/BackgroundGfx'

class GameOver extends Scene {
  constructor () {
    super({ key: 'GameOver' })
  }

  init ({ fromWorld }) {
    this.fromWorld = fromWorld
  }

  create () {
    const { ENTER, UP, DOWN } = Input.Keyboard.KeyCodes
    this.cameras.main.setBackgroundColor('#0d2030')

    this.bgGfx = new BackgroundGfx({ scene: this })

    this.add.bitmapText(146, 85, 'font', 'Try Again', 16)

    this.menuPos = 1

    this.add.bitmapText(146, 105, 'font', 'Quit', 16)
    this.menuPositions = 2

    this.spr = this.add.sprite(130, 90, 'life')

    this.prevState = {
      startKey: true,
      upKey: true,
      downKey: true
    }

    this.startKey = this.input.keyboard.addKey(ENTER)
    this.upKey = this.input.keyboard.addKey(UP)
    this.downKey = this.input.keyboard.addKey(DOWN)

    this.cameras.main.fadeIn(2000)

    // this.music = this.sound.playAudioSprite('soundtrack', 'intro', { loop: true })
  }

  update () {
    if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1) {
      this.pauseMusic()
      this.continue()
      return
    } else if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2) {
      this.quit()
    }

    if (this.downKey.isDown && this.downKey.isDown !== this.prevState.downKey) {
      if (this.menuPos === this.menuPositions) {
        this.menuPos = this.menuPositions // only for main
      } else {
        // this.sound.playAudioSprite('soundtrack', 'selector', { volume: 0.5 })
        this.menuPos++
      }
    } else if (this.upKey.isDown && this.upKey.isDown !== this.prevState.upKey) {
      if (this.menuPos === 1) {
        this.menuPos = 1 // only for main
      } else {
        // this.sound.playAudioSprite('soundtrack', 'selector', { volume: 0.5 })
        this.menuPos--
      }
    }

    this.spr.y = this.menuPos * 20 + 70

    this.prevState = {
      startKey: this.startKey.isDown,
      upKey: this.upKey.isDown,
      downKey: this.downKey.isDown
    }

    this.bgGfx.update()
  }

  continue () {
    // this.clearKeys()
    this.scene.start('GameScene', { worldName: this.fromWorld })
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

  // clearKeys () {
  //   this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  //   this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W)
  //   this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.S)
  // }
}

export default GameOver
