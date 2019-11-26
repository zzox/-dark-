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

    let lastUnlocked = false
    for (let i = 0; i < this.overworld.worlds.length; i++) {
      let item = this.overworld.worlds[i]

      if (finished.includes(item.name)) {
        this.add.image(item.x + 24, item.y, 'finished-world')
      } else {
        this.add.image(item.x + 24, item.y, 'locked-world')
      }

      this.worldDict[item.name] = item
    }

    this.moving = false
  }

  update () {
    // check avaliable dirs for which direction to go
  }

  moving () {
    this.moving = true
  }

  endMoving () {
    this.moving = false
  }
}

export default WorldScene
