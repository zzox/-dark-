import { Scene } from 'phaser'

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

    this.load.image('world-map', 'assets/images/world-map.png')
    this.load.image('finished-world', 'assets/images/finished-world.png')
    this.load.image('unlocked-world', 'assets/images/unlocked-world.png')
    this.load.image('locked-world', 'assets/images/locked-world.png')

  }

  create () {
    window.addEventListener('resize', () => {
      this.resize()
    })

    this.scene.start('TitleScene')
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
