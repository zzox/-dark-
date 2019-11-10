import { GameObjects } from 'phaser'
import Melee from '../gameobjects/Melee'
import {
  hurtFlash,
  quickHurtFlash
} from './helpers'

const CLEAR_TINT = 0xFFFFFF

class Player extends GameObjects.Sprite {
  constructor ({ scene, x, y }) {
    super(scene, x, y)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.name = 'player'

    this.body.setSize(10, 12)
    this.body.offset.set(3, 4)

    this.acceleration = 800
    this.body.maxVelocity.set(120, 200)
    this.body.drag.set(1000, 0)

    this.body.setCollideWorldBounds(true)

    this.jumps = 0
    this.maxJumps = 2
    this.jumpTime = 0
    this.jumpTimer = 150
    this.isFalling = false
    this.jumpVelocity = 200

    this.animation = 'stand'

    this.alive = true
    this.hitPoints = 100

    this.meleeName = 'wand'
    // this.meleeConfig = this.scene.cache.json.entries.entries.melees[this.meleeName]
    this.melee = new Melee({
      owner: this,
      scene: this.scene,
      x: this.x,
      y: this.y
    })

    this.projName = 'ball'
    this.projConfig = this.scene.cache.json.entries.entries.projectiles[this.projName]
    console.log(this.projConfig)

    this.state = {
      canRun: true,
      canRunTimer: 0,
      canJump: true,
      canJumpTimer: 0,
      hurt: false,
      hurtTimer: 0,
      hurtStep: 0,
      healthIncTimer: 0,
      healthIncTime: 1000,
      swinging: false,
      swingingTime: 0,
      shooting: false,
      shootingTime: 0,
      postShooting: false,
      postShootTime: 0
    }

    this.prevState = {
      jump: true,
      melee: true,
      shoot: true,
      flipX: true,
      blockedDown: true
    }
  }

  update (delta, keys) {
    const input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      up: keys.up.isDown,
      down: keys.down.isDown,
      jump: keys.jump.isDown,
      melee: keys.melee.isDown,
      shoot: keys.shoot.isDown,
      dash: keys.dash.isDown
    }

    const holds = {
      left: keys.left.timeDown,
      right: keys.right.timeDown,
      up: keys.up.timeDown,
      down: keys.down.timeDown,
      jump: keys.jump.timeDown,
      shoot: keys.shoot.timeDown,
      melee: keys.melee.timeDown,
      dash: keys.dash.timeDown
    }

    let vel = 0

    if (input.melee && !this.prevState.melee) {
      this.swing()
    }

    if (input.shoot && !this.prevState.shoot) {
      this.shoot()
    }

    this.updateStates(delta, input)

    if (input.right) {
      vel = 1
    }

    if (input.left) {
      vel = -1
    }

    if (input.left && input.right) {
      if (holds.right > holds.left) {
        vel = 1
      } else {
        vel = -1
      }
    }

    if (!input.jump) {
      this.jumping = false
      this.jumpTime = 0
    }

    if (this.body.blocked.down) {
      this.jumpTime = 0
      this.jumps = 0
      this.jumping = false
    }

    if (!this.state.shooting && !this.state.postShooting &&
      !(this.state.swinging && this.state.swingingTime < this.melee.swingDone)) {
      if (((input.jump && !this.prevState.jump) &&
        (this.jumps < this.maxJumps)) ||
        (input.jump && this.jumping &&
        this.jumpTime < this.jumpTimer &&
        this.jumps <= this.maxJumps)) {
        this.jumpTime += delta

        if (input.jump && !this.prevState.jump) {
          this.body.setVelocityY(-this.jumpVelocity)
          this.jumping = true
          this.jumps++
        } else {
          this.body.setVelocityY(-this.jumpVelocity / 1.5)
        }
      }
    }

    this.run(vel)

    this.updateAnimations()

    this.anims.play(`${this.name}-${this.animation}`, true)

    this.prevState = {
      jump: input.jump,
      melee: input.melee,
      shoot: input.shoot,
      switchMelee: input.switchMelee,
      switchProj: input.switchProj,
      flipX: this.flipX,
      blockedDown: this.body.blocked.down
    }
  }

  updateStates (delta, input) {
    if (this.hitPoints <= 0) {
      // TODO: turn into death screen
      this.scene.endWithLoss()
      // this.scene.scene.start('BootScene')
    }

    if (this.state.hurt) {
      if (this.state.hurtTimer > 0) {
        this.state.hurtTimer -= delta
        this.state.hurtStep++

        // LATER: quickflash for different times?
        const tint = this.state.hurtStep % hurtFlash.length
        this.setTint(hurtFlash[tint])
      } else if (this.state.hurtTimer < 0) {
        this.state.hurt = false
        this.state.hurtStep = 0
        this.setTint(CLEAR_TINT)
        this.state.healthIncTimer = 0
      }
    }

    // TODO: Remove this stuff?
    if (!this.hurt && this.hitPoints !== 100) {
      if (this.state.healthIncTimer < this.state.healthIncTime) {
        let multi = 1
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
          multi = 3
        }

        this.state.healthIncTimer += (delta * multi)
      } else {
        this.hitPoints++
        this.state.healthIncTimer = 0
      }
    }

    if (this.state.swinging) {
      this.state.swingingTime += delta

      const canLetGo = this.melee.update(this.state.swingingTime, this.x, this.y, this.flipX ? 'right' : 'left')

      // ATTN: having it down here makes us release one frame late.
      if (!input.melee && canLetGo) {
        this.state.swinging = false
        this.state.swingingTime = 0
        this.melee.hide()
      }
    }

    if (this.state.shooting) {
      // BUG: here?  what if something sneaks through here
      if (input.shoot && this.state.shootingTime < this.projConfig.maxHoldTime) {
        this.state.shootingTime += delta
      } else {
        const proj = this.scene.projectiles.get()

        let vel = this.state.shootingTime / this.projConfig.maxHoldTime

        if (vel > 1) {
          vel = 1
        }

        const data = {
          x: this.x,
          y: this.y,
          xVel: vel * this.projConfig.velocityX,
          yVel: vel * this.projConfig.velocityY,
          dir: this.flipX ? 'right' : 'left',
          name: this.projName,
          fromActor: 'player',
          ...this.projConfig
        }

        if (proj) {
          proj.fire(data)
        } else {
          // TODO: Remove this!!!
          alert('need more projectiles!')
        }

        this.state.shooting = false
        this.state.shootingTime = 0
        this.state.postShooting = true
        this.state.postShootingTime = this.projConfig.fireTime
      }
    }

    if (this.state.postShooting) {
      if (this.state.postShootingTime > 0) {
        this.state.postShootingTime -= delta
      } else {
        this.state.postShooting = false
        this.state.postShootingTime = 0
      }
    }

    if (this.state.lastFiredTime > 0) {
      this.state.lastFiredTime -= delta
    }

    if (!this.state.canRun) {
      if (this.state.canRunTimer > 0) {
        this.state.canRunTimer -= delta
      } else if (this.state.canRunTimer < 0) {
        this.state.canRun = true
      }
    }

    if (!this.state.canJump) {
      if (this.state.canJumpTimer > 0) {
        this.state.canJumpTimer -= delta
      } else if (this.state.canJumpTimer < 0) {
        this.state.canJump = true
      }
    }
  }

  updateAnimations () {
    if (this.state.shooting) {
      this.animation = 'throw-hold'
    } else if (this.state.postShooting) {
      this.animation = 'throw'
    } else if (this.state.swinging) {
      const swingTime = this.state.swingingTime

      if (this.melee.swingingDir === 'up') {
        this.animation = 'swing-up'
      } else if (this.melee.swingingDir === 'down') {
        this.animation = 'swing-down'
      } else if (swingTime > this.melee.swingHigh) {
        if (this.body.blocked.down) {
          if (this.body.velocity.x !== 0) {
            this.animation = 'swing-run'
          } else {
            this.animation = 'swing-hold'
          }
        } else {
          this.animation = 'swing-hold'
        }
      }
    } else {
      if (this.body.velocity.y) {
        this.animation = 'jump'
      } else if (this.body.velocity.x) {
        this.animation = 'run'
      } else {
        this.animation = 'stand'
      }
    }
  }

  run (dir) {
    let vel = this.acceleration * dir

    if (!this.state.canRun ||
      (this.body.blocked.down && this.state.shooting) ||
      (this.body.blocked.down && this.state.postShooting) ||
      (this.body.blocked.down && this.state.swinging &&
      this.state.swingingTime > this.melee.swingStart &&
      this.state.swingingTime < this.melee.swingHigh)) {
      // might need to add animations to make it look more convincing that you can't run
      // or, set the velocity to whatever it was at. <-- better, only for the canrun, not swinging
      vel = 0
    }

    if (this.body.velocity.y === 0 && this.body.blocked.down) {
      this.body.setAccelerationX(vel)
    } else {
      this.body.setAccelerationX(vel / 3)
    }

    if (true && dir !== 0 && !this.state.swinging /* && !this.shooting */) {
      this.flipX = dir >= 0
    }
  }

  swing () {
    // TODO: check if can swing
    if (!this.state.shooting && !this.state.shooting && !this.state.postShooting) {
      this.state.swinging = true
    }
  }

  shoot () {
    if (!this.state.swinging && !this.state.shooting && !this.state.postShooting) {
      this.state.shooting = true
    }
  }

  damage (amount) {
    this.hitPoints -= amount
    this.state.hurt = true
    this.state.hurtTimer = 800
  }
}

export default Player
