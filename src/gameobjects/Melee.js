import { GameObjects } from 'phaser'

const MED_VOL = { volume: 0.3 }

class Melee extends GameObjects.Sprite {
  constructor ({ scene, x, y, owner, ...config }) {
    super(scene, x, y)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.name = 'wand' // config.name
    this.body.allowGravity = false
    this.direction = 'left'
    this.visible = false

    this.swingStart = 50
    this.swingLow = 125
    this.swingHigh = 200
    this.swingDone = 250

    this.owner = owner

    this.swingingDir = null
    this.soundPlayed = false

    this.minimumSwingComplete = false
  }

  update (holdTime, x, y, dir) {
    this.direction = dir

    if (holdTime > this.swingDone) {
      this.minimumSwingComplete = true
    } else {
      this.minimumSwingComplete = false
    }

    this.body.velocity.x = this.owner.body.velocity.x
    this.body.velocity.y = this.owner.body.velocity.y

    if (holdTime > this.swingStart && holdTime <= this.swingLow) {
      this.visible = true
      this.body.setSize(4, 12)
      this.body.offset.set(6, 3)
      if (this.direction === 'left') {
        this.x = x - 4
        this.flipX = false
      } else {
        this.x = x + 4
        this.flipX = true
      }
      this.y = y - 11
      this.anims.play(`${this.name}-up`, true)
      this.swingingDir = 'up'

      this.scene.physics.world.overlap(this, this.scene.enemies, this.hitEnemy)
      this.scene.physics.world.overlap(this, this.scene.projectiles, this.hitProj)
    } else if (holdTime > this.swingLow && holdTime <= this.swingHigh) {
      this.visible = true
      this.body.setSize(12, 13)
      this.body.setOffset(2, 2)
      if (this.direction === 'left') {
        this.x = x - 11
        this.flipX = false
      } else {
        this.x = x + 11
        this.flipX = true
      }
      this.y = y - 1
      this.anims.play(`${this.name}-swing`, true)
      this.swingingDir = 'down'

      this.scene.physics.world.overlap(this, this.scene.enemies, this.hitEnemy)
      this.scene.physics.world.overlap(this, this.scene.projectiles, this.hitProj)
      if (!this.soundPlayed) {
        this.soundPlayed = true
        this.scene.sound.playAudioSprite('sfx', 'player-swing', MED_VOL)
      }
    } else if (holdTime > this.swingHigh) {
      this.visible = true
      this.body.setSize(12, 4)
      this.body.setOffset(2, 10)
      if (this.direction === 'left') {
        this.x = x - 11
        this.flipX = false
      } else {
        this.x = x + 11
        this.flipX = true
      }
      this.y = y - 1
      this.anims.play(`${this.name}-down`, true)
      this.swingingDir = null

      this.scene.physics.world.overlap(this, this.scene.enemies, this.hitEnemy)
      this.scene.physics.world.overlap(this, this.scene.projectiles, this.hitProj)
      // TODO: add all other layers.
      this.scene.physics.world.overlap(this, this.scene.groundLayer, this.cancelSwing)
    }

    return this.minimumSwingComplete
  }

  hitEnemy (melee, enemy) {
    const swingComplete = melee.minimumSwingComplete

    if (!enemy.state.hurt) {
      let dir = 0
      let hurtMulti = 1
      if (melee.direction === 'left') {
        dir = -1
      } else if (melee.direction === 'right') {
        dir = 1
      } else {
        // TODO: Remove
        alert('shoouldn\'t be here')
      }

      let xVel, yVel
      if (melee.swingingDir === 'up') {
        xVel = (enemy.lightness + Math.abs(enemy.body.velocity.x)) * dir
        yVel = enemy.body.velocity.y
      } else if (melee.swingingDir === 'down') {
        xVel = (enemy.lightness + Math.abs(enemy.body.velocity.x)) * dir
        yVel = (enemy.body.velocity.y + enemy.lightness) * -1
      } else {
        hurtMulti = 0.5
        xVel = enemy.lightness * dir * 0.5
        yVel = enemy.lightness * -1
      }

      enemy.body.setVelocity(xVel, yVel)
      enemy.hurt(hurtMulti)
    }

    if (swingComplete) {
      melee.cancel()
    }
  }

  hitProj (melee, proj) {
    // TODO:
    const swingComplete = melee.minimumSwingComplete

    const MELEE_POWER = 100

    if (!proj.exploded) {
      let dir = 0
      let hurtMulti = 1
      if (melee.direction === 'left') {
        dir = -1
      } else if (melee.direction === 'right') {
        dir = 1
      } else {
        // TODO: Remove
        alert('shoouldn\'t be here')
      }

      let xVel, yVel
      if (melee.swingingDir === 'up') {
        xVel = (MELEE_POWER + Math.abs(proj.body.velocity.x)) * dir
        yVel = proj.body.velocity.y
      } else if (melee.swingingDir === 'down') {
        xVel = (MELEE_POWER + Math.abs(proj.body.velocity.x)) * dir
        yVel = (proj.body.velocity.y + MELEE_POWER) * -1
      } else {
        hurtMulti = 0.5
        xVel = proj.body.velocity.x * dir * 0.5
        yVel = proj.body.velocity.y * -1
      }

      proj.body.setVelocity(xVel * hurtMulti, yVel * hurtMulti)
    }

    if (swingComplete) {
      melee.cancel()
    }
  }

  cancelSwing (melee, tile) {
    const holder = melee.owner.state
    if (tile.canCollide && holder.swingingTime > melee.swingHigh) {
      melee.cancel()
    }
  }

  cancel () {
    this.owner.state.swinging = false
    this.owner.state.swingingTime = 0
    this.hide()
  }

  hide () {
    this.soundPlayed = false
    this.visible = false
    this.x = -10
    this.y = -10
    this.body.setVelocity(0, 0)
  }
}

export default Melee
