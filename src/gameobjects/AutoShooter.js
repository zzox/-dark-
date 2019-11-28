import { GameObjects } from 'phaser'

class AutoShooter extends GameObjects.Sprite {
  constructor ({ scene, x, y, dir, roomIndex, texture, time = 1000, delay = 0 }) {
    super(scene, x, y, texture)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.body.setAllowGravity(false)
    this.body.setImmovable(true)

    this.time = time
    this.timer = time
    this.delay = delay
    this.roomIndex = roomIndex

    this.construct(dir)

    this.projName = 'ball'
    this.projConfig = this.scene.cache.json.entries.entries.projectiles[this.projName]
  }

  update (delta) {
    if (this.scene.currentRoom === this.roomIndex) {
      if (this.delay > 0) {
        this.delay -= delta
      } else {
        if (this.timer > 0) {
          this.timer -= delta
        } else {
          this.fire()
          this.timer = this.time
        }
      }
    }
  }

  fire () {
    const proj = this.scene.projectiles.get()

    proj.fire({
      x: this.xFirePos,
      y: this.yFirePos,
      xVel: this.xVel,
      yVel: this.yVel,
      name: this.projName,
      ...this.projConfig
    })
  }

  // TODO: REMOVE?
  activate () {
    this.isActive = true
  }

  construct (dir) {
    switch (dir) {
      case 'up':
        this.body.setSize(16, 8)
        this.body.setOffset(0, 8)
        this.xFirePos = this.x
        this.yFirePos = this.y - 8
        this.xVel = 0
        this.yVel = -500
        break
      case 'up-left':
        this.body.setSize(8, 8)
        this.body.setOffset(8, 8)
        this.xFirePos = this.x - 8
        this.yFirePos = this.y - 8
        this.xVel = -333
        this.yVel = -333
        break
      case 'up-right':
        this.x = this.x + 8
        this.body.setSize(8, 8)
        this.body.setOffset(0, 8)
        this.xFirePos = this.x + 8
        this.yFirePos = this.y - 8
        this.xVel = 333
        this.yVel = -333
        this.flipX = true
        break
      default:
        break
    }
  }
}

export default AutoShooter
