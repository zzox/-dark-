import { GameObjects } from 'phaser'

class Projectile extends GameObjects.Sprite {
  constructor (scene) {
    super(scene)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.body.setCollideWorldBounds(true)

    this.setPosition(0)
    this.body.allowGravity = false
    this.setActive(false)
    this.setVisible(false)

    this.timed = false
    this.aliveTime = 0
    this.aliveTimer = 3000
    this.hitTime = 0
    this.hitTimer = 500

    this.direction = 'left'
    this.prevState = {
      dir: 'zero'
    }
  }

  fire ({
    x,
    y,
    dir,
    fromActor,
    bounce,
    name,
    xVel,
    yVel,
    canFlipY,
    missGround,
    explodeGround,
    damage,
    blowback,
    fadeOut,
    spawnChildren,
    childrenPattern,
    explodeTimer,
    activeExplosion
  }) {
    // TODO: remove damage,
    this.exploded = false
    this.hit = false
    this.hitTime = 0

    // ATTN: are these values being properly reset?
    this.canFlipY = canFlipY
    this.missGround = missGround
    this.from = fromActor
    this.name = name
    this.body.allowGravity = true
    this.direction = dir
    this.damage = damage
    this.blowback = blowback
    this.explodeGround = explodeGround
    this.spawnChildren = spawnChildren
    this.childrenPattern = childrenPattern
    this.explodeTimer = explodeTimer
    this.activeExplosion = activeExplosion
    this.fadeOut = fadeOut

    if (this.explodeTimer) {
      this.explodeTime = 0
    } else {
      this.explodeTimer = false
    }

    this.setActive(true)
    this.setVisible(true)
    this.body.allowGravity = true

    this.body.setSize(8, 8)
    this.body.offset.set(4, 4)
    this.setPosition(x, y)
    this.body.setVelocity(xVel * (dir === 'left' ? -1 : 1), yVel)

    this.body.bounce = { x: 0.75, y: 0.75 }

    if (dir === 'right') {
      this.flipX = true
    } else {
      this.flipX = false
    }

    this.anims.play(`${this.name}-move`, true)
  }

  update (time, delta) {
    if (!this.active) {
      return
    }

    if (this.scene.groundLayer && !this.missGround && this.explodeGround) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.hitGround.bind(this))
    }

    if (!this.explodeGround) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.dragGround.bind(this))
    }

    // TODO: Remove this, and we check if it collides with anything, besides
    // collision with itself.  In that case, we need to add a timer so that we don't hit ourselves
    // on the first couple frames.
    if (this.from === 'player') {
      if (!(this.exploded && !this.activeExplosion)) {
        this.scene.physics.world.overlap(this, this.scene.enemies, this.hitEnemy.bind(this))
      }
    } else if (this.from === 'enemy') {
      this.scene.physics.world.overlap(this, this.scene.player, this.hitEnemy.bind(this))
    }

    if (this.canFlipY) {
      if (this.body.velocity.y < 0) {
        this.flipY = true
      } else {
        this.flipY = false
      }
    }

    if (this.body.velocity.x < 0) {
      this.flipX = false
    } else {
      this.flipX = true
    }

    if (this.hit) {
      if (this.hitTime > this.hitTimer) {
        this.disappear()
      } else {
        if (this.fadeOut) {
          this.alpha = 1 - this.hitTime / this.hitTimer
        }

        this.hitTime += delta
      }
    }

    if (this.y > this.scene.groundLayer.height + 50) {
      this.disappear()
    }

    if (this.explodeTimer) {
      if (this.explodeTime > this.explodeTimer && !this.exploded) {
        this.explode()
      } else {
        this.explodeTime += delta
      }
    }

    this.prevState = {
      dir: this.body.velocity.x > 0
        ? 'right'
        : this.body.velocity.x < 0
          ? 'left' : 'zero'
    }
  }

  hitGround () {
    this.hit = true
    this.anims.play(`${this.name}-explode`, true)
    this.body.setVelocity(0, 0)
    this.body.allowGravity = false
  }

  dragGround () {
    this.body.setVelocityX(this.body.velocity.x / 1.25)
  }

  hitEnemy (projectile, enemy) {
    if (enemy.state.hurt === false && enemy.alive === true) {
      enemy.hit()
      this.explode()
    }
  }

  disappear () {
    this.setActive(false)
    this.setVisible(false)
    this.body.setVelocity(0, 0)
    this.body.allowGravity = false
    this.setPosition(-100, -100)
    this.alpha = 1
  }

  explode () {
    this.exploded = true

    if (this.spawnChildren) {
      this.spawnChildrens()
      this.disappear()
    }
    
    this.anims.play(`${this.name}-explode`, true)
    this.body.setVelocity(0, 0)
    this.body.allowGravity = false
    this.hit = true
  }

  spawnChildrens () {
    if (this.childrenPattern === 'plus') {
      this.plusPattern('sparkle').map(item => {
        const proj = this.scene.projectiles.get()
        proj.fire(item)
      })
    }
  }

  plusPattern (name) {
    const details = this.scene.weaponsConfig[name]
    return [
      { ...details, name, x: this.x, y: this.y, fromActor: this.fromActor, velocityX: 0, velocityY: 300 },
      { ...details, name, x: this.x, y: this.y, fromActor: this.fromActor, velocityX: 0, velocityY: -300 },
      { ...details, name, x: this.x, y: this.y, fromActor: this.fromActor, velocityX: 300, velocityY: 0 },
      { ...details, name, x: this.x, y: this.y, fromActor: this.fromActor, velocityX: -300, velocityY: 0 }
    ]
  }
}

export default Projectile
