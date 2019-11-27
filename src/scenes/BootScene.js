import { Scene } from 'phaser'

const EIGHT_TILESET = { frameWidth: 8, frameHeight: 8 }
const SIXTEEN_EXTRUDED_TILESET = { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 }

class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.resize()

    this.load.bitmapFont('font', 'assets/fonts/manaspace.png', 'assets/fonts/manaspace.fnt')
    this.load.json('animations', 'assets/data/animations.json')
    this.load.json('worlds', 'assets/data/worlds.json')
    this.load.json('projectiles', 'assets/data/projectiles.json')
    this.load.json('pests', 'assets/data/pests.json')
    this.load.json('overworld', 'assets/data/overworld.json')

    this.load.spritesheet('tiles', 'assets/images/tilesets/tiles.png', EIGHT_TILESET)
    this.load.spritesheet('player', 'assets/images/spritesheets/player.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('hopper-purple', 'assets/images/spritesheets/hopper-purple.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('shooter-green', 'assets/images/spritesheets/walker-green.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('wand', 'assets/images/spritesheets/wand.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('ball', 'assets/images/spritesheets/ball.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.image('one-bg', 'assets/images/backgrounds/one-bg.png')
    this.load.image('bar', 'assets/images/bar.png')
    this.load.image('bar-shine', 'assets/images/bar-shine.png')
    this.load.image('door', 'assets/images/door.png')
    this.load.image('aimer', 'assets/images/aimer.png')
    this.load.image('life', 'assets/images/life.png')
    this.load.image('world-map', 'assets/images/world-map.png')
    this.load.image('finished-world', 'assets/images/finished-world.png')
    this.load.image('unlocked-world', 'assets/images/unlocked-world.png')
    this.load.image('locked-world', 'assets/images/locked-world.png')

    this.animsArray = ['player', 'shooter-green', 'hopper-purple', 'wand', 'ball']
  }

  create () {
    this.animsConfig = this.cache.json.entries.entries.animations
    this.createAnimations()

    window.addEventListener('resize', () => {
      this.resize()
    })

    this.scene.start('TitleScene')
  }

  createAnimations () {
    if (this.anims.anims) {
      this.anims.anims.clear()
    }

    this.animsArray.map(item => {
      let items
      const alias = this.animsConfig[item].alias

      if (alias) {
        items = this.animsConfig[alias].anims
      } else {
        items = this.animsConfig[item].anims
      }

      items.map(anim => {
        this.anims.create({
          key: `${item}-${anim.key}`,
          //                                sheet vvv
          frames: this.anims.generateFrameNumbers(item, anim.frames),
          frameRate: anim.frameRate ? anim.frameRate : 1,
          repeat: anim.repeat ? anim.repeat : -1,
          repeatDelay: anim.repeatDelay ? anim.repeatDelay : 0
        })
      })
    })
  }

  resize () {
    const maxMulti = 4
    const w = 320
    const h = 180
    const availW = window.innerWidth
    const availH = window.innerHeight
    // - 20 for padding
    const maxW = Math.floor(availW / w)
    const maxH = Math.floor(availH / h)
    let multi = maxW < maxH ? maxW : maxH

    if (multi > maxMulti) multi = maxMulti

    const canvas = document.getElementsByTagName('canvas')[0]
    canvas.style.width = `${multi * w}px`
    canvas.style.height = `${multi * h}px`
  }
}

export default BootScene
