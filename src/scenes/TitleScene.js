import { Scene, Input } from 'phaser'
import { createMaster } from '../utils/worldData'
import store from 'store'
import BackgroundGfx from '../gameobjects/BackgroundGfx'

class TitleScene extends Scene {
  constructor () {
    super({ key: 'TitleScene' })
  }

  create () {
    const { ENTER, UP, DOWN } = Input.Keyboard.KeyCodes
    // this.add.image(240, 80, 'static-title')
    this.cameras.main.setBackgroundColor('#0d2030')

    this.bgGfx = new BackgroundGfx({ scene: this })

    this.add.bitmapText(138, 135, 'font', 'New Game', 16)

    this.menuPos = 1

    const continuedGame = store.get('dark-session')
    if (continuedGame) {
      this.add.bitmapText(138, 155, 'font', 'Continue', 16)
      this.menuPositions = 2
    } else {
      this.menuPositions = 1
    }

    createMaster(continuedGame ? continuedGame.finished : [])

    this.spr = this.add.sprite(122, 140, 'life')

    this.prevState = {
      startKey: true,
      upKey: true,
      downKey: true
    }

    this.startKey = this.input.keyboard.addKey(ENTER)
    this.upKey = this.input.keyboard.addKey(UP)
    this.downKey = this.input.keyboard.addKey(DOWN)

    this.cameras.main.fadeIn(2000)

    this.music = this.sound.playAudioSprite('songs', 'dark-two', { loop: true })

    this.title = this.add.sprite(160, 64)
    this.title.play('title-flash')
    this.title.setScale(2)
  }

  update () {
    if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1) {
      this.pauseMusic()
      this.newGame()
      return
    } else if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2) {
      this.pauseMusic()
      this.loadGame()
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

    this.spr.y = this.menuPos * 20 + 120

    this.prevState = {
      startKey: this.startKey.isDown,
      upKey: this.upKey.isDown,
      downKey: this.downKey.isDown
    }

    this.bgGfx.update()
  }

  newGame () {
    store.remove('dark-session')
    this.scene.start('GameScene', { worldName: 'one' })
  }

  loadGame () {
    this.scene.start('WorldScene')
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].key === 'songs') {
        this.sound.sounds[i].pause()
      }
    }
  }
}

export default TitleScene
