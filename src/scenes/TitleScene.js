import { Scene, Input } from 'phaser'
import store from 'store'

class TitleScene extends Scene {
  constructor () {
    super({ key: 'TitleScene' })
  }

  preload () {
    this.load.image('life', 'assets/images/life.png')
    // TODO: make animations and load everything in boot scene.
    // this.load.spritesheet('title', 'assets/images/spritesheets/title.png')
  }

  create(){
    let { ENTER, UP, DOWN } = Input.Keyboard.KeyCodes
    // this.add.image(240, 80, 'static-title')
    this.cameras.main.setBackgroundColor('#0d2030')

    this.add.bitmapText(146, 135, 'font', 'New Game', 16)

    this.menuPos = 1

    let continuedGame = store.get('dark-session')
    if (continuedGame) {
      this.add.bitmapText(146, 155, 'font', 'Continue', 16)
      this.menuPositions = 2
    } else {
      this.menuPositions = 1
    }

    this.spr = this.add.sprite(130, 140, 'life')

    this.prevState = {
      startKey: true,
      upKey: true,
      downKey: true
    }

    this.startKey = this.input.keyboard.addKey(ENTER)
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    this.cameras.main.fadeIn(2000)

    // this.music = this.sound.playAudioSprite('soundtrack', 'intro', { loop: true })
  }

  update () {
    if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 1) {
      this.pauseMusic()
      this.newGame()
      return
    } else if (this.startKey.isDown && !this.prevState.startKey && this.menuPos === 2) {
      this.loadGame()
    }

    if(this.downKey.isDown && this.downKey.isDown !== this.prevState.downKey){
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
  }

  newGame () {
    // this.clearKeys()
    this.scene.start('GameScene', { worldName: 'one' })
  }

  loadGame (){ 
    console.log('loading game')
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

export default TitleScene
