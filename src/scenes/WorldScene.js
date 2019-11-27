import { Scene, Input } from 'phaser'
import { getWorlds } from '../utils/worldData'

class WorldScene extends Scene {
  constructor () {
    super({ key: 'WorldScene' })
  }

  create () {
    const { ENTER, UP, DOWN, LEFT, RIGHT } = Input.Keyboard.KeyCodes

    let { finished } = getWorlds()

    this.keys = {
      start: this.input.keyboard.addKey(ENTER),
      up: this.input.keyboard.addKey(UP),
      down: this.input.keyboard.addKey(DOWN),
      left: this.input.keyboard.addKey(LEFT),
      right: this.input.keyboard.addKey(RIGHT)
    }

    this.add.image(180, 90, 'world-map')

    this.overworld = this.cache.json.entries.entries.overworld
    this.worldDict = {}

    let lastUnlocked = true
    for (let i = 0; i < this.overworld.worlds.length; i++) {
      let item = this.overworld.worlds[i]

      if (finished.includes(item.name)) {
        lastUnlocked = true
        this.add.image(item.x + 24, item.y, 'finished-world')
      } else {
        if (lastUnlocked) {
          this.add.image(item.x + 24, item.y, 'unlocked-world')
          this.current = item
        } else {
          item.locked = true
          this.add.image(item.x + 24, item.y, 'locked-world')
        }

        lastUnlocked = false
      }

      this.worldDict[item.name] = item
    }

    this.moving = false
    this.selected = false

    this.spr = this.add.sprite(this.current.x + 24, this.current.y - 8)
    this.spr.play('player-stand')

    this.prevState = {
      start: true,
      up: true,
      down: true,
      left: true,
      right: true
    }
  }

  update () {
    // spagett
    if (!this.moving && !this.selected) {
      if (this.keys.start.isDown && !this.prevState.start) {
        this.scene.start('GameScene', { worldName: this.current.name })
      } else {
        if (this.current.back && this.keys[this.current.backDir].isDown &&
          !this.prevState[this.current.backDir]) {
          this.move(this.current.back, this.current.backFlipX)
        }

        if (this.current.forward && this.keys[this.current.forwardDir].isDown &&
          !this.prevState[this.current.forwardDir]) {
          this.move(this.current.forward, this.current.forwardFlipX)
        }
      }
    }

    if (this.moving) {
      this.spr.play('player-run', true)
    } else if (this.selected) {
      this.spr.play('player-swing-up')
    } else {
      this.spr.play('player-stand')
    }

    this.prevState = {
      start: this.keys.start.isDown,
      up: this.keys.up.isDown,
      down: this.keys.down.isDown,
      left: this.keys.left.isDown,
      right: this.keys.right.isDown
    }
  }

  move (to, flipX) {
    const toItem = this.worldDict[to]
    if (toItem.locked) {
      // TODO: play sound here
    } else {
      this.spr.flipX = flipX

      this.tweens.add({
        targets: this.spr,
        x: { from: this.spr.x, to: toItem.x + 24 },
        y: { from: this.spr.y, to: toItem.y - 8 },
        ease: 'Linear',
        duration: 750,
        repeat: 0,
        onComplete: this.endMoving.bind(this)
      })

      this.current = toItem
      this.moving = true
    }
  }

  endMoving () {
    this.moving = false
  }
}

export default WorldScene
