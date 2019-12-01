import { GameObjects } from 'phaser'

const MIN_EXPLODE_TIME = 120
const LOW_VOL = { volume: 0.2 }
const MED_VOL = { volume: 0.35 }
const HI_VOL = { volume: 0.75 }

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
    this.hitTimer = 333

    this.direction = 'left'
    this.prevState = {
      dir: 'zero'
    }
  }

  fire ({
    x,
    y,
    dir,
    bounce,
    name,
    xVel,
    yVel,
    canFlipY,
    missGround,
    explodeGround,
    fromActor,
    damage,
    blowback,
    fadeOut,
    spawnChildren,
    childrenPattern,
    explodeTimer = 3000,
    activeExplosion
  }) {
    // TODO: remove damage, blowback
    this.exploded = false
    this.hit = false
    this.hitTime = 0

    // ATTN: are these values being properly reset?
    this.canFlipY = canFlipY
    this.missGround = missGround
    this.name = name
    this.body.allowGravity = true
    this.direction = dir
    this.damage = damage
    this.blowback = blowback
    this.fromActor = fromActor
    this.explodeGround = explodeGround
    this.spawnChildren = spawnChildren
    this.childrenPattern = childrenPattern
    this.explodeTimer = explodeTimer
    this.activeExplosion = activeExplosion
    this.fadeOut = fadeOut
    this.explodeTime = 0

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

  update (delta) {
    if (!this.active) {
      return
    }

    if (this.scene.groundLayer && !this.missGround && this.explodeGround) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.hitGround.bind(this))
    }

    if (!this.explodeGround) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.dragGround.bind(this))
      this.scene.physics.world.collide(this, this.scene.autos, this.hitGround.bind(this))
    }

    if (this.explodeTime > MIN_EXPLODE_TIME || (this.fromActor !== 'player' && this.fromActor !== 'pest')) {
      this.scene.physics.world.overlap(this, this.scene.enemies, this.hitEnemy.bind(this))
      if (!this.scene.player.state.hurt && !this.scene.player.state.resurrecting) {
        this.scene.physics.world.overlap(this, this.scene.player, this.hitEnemy.bind(this))
      }
    }

    if (this.canFlipY) {
      if (this.body.velocity.y < 0) {
        this.flipY = true
      } else {
        this.flipY = false
      }
    }

    if (this.body.velocity.x < 0) {
      this.flipX = true
    } else {
      this.flipX = false
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

    if (this.explodeTime > this.explodeTimer && !this.exploded) {
      this.explode()
    } else {
      this.explodeTime += delta
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
    this.anims.play(`${this.name}-explode`, true)
    this.body.setVelocity(0, 0)
    this.body.allowGravity = false
    this.hit = true
    this.scene.sound.playAudioSprite('sfx', 'proj-explode', HI_VOL)
  }
}

export default Projectile
