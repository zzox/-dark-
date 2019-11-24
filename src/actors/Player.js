import { GameObjects } from 'phaser'
import Melee from '../gameobjects/Melee'
import {
  hurtFlash,
  quickHurtFlash,
  visibleFlash,
  quickVisibleFlash
} from './helpers'

class Player extends GameObjects.Sprite {
  constructor ({ scene, x, y, lives }) {
    super(scene, x, y)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.name = 'player'

    this.body.setSize(8, 11)
    this.body.offset.set(4, 5)

    this.acceleration = 800
    this.body.maxVelocity.set(120, 200)
    this.body.drag.set(1000, 0)

    this.body.setCollideWorldBounds(true)

    this.lives = lives
    this.jumps = 0
    this.maxJumps = 2
    this.jumpTime = 0
    this.jumpTimer = 150
    this.isFalling = false
    this.jumpVelocity = 200

    this.animation = 'stand'

    // TODO: Remove Dynamics
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

    this.startingState()
  }

  startingState (killed = false) {
    this.state = {
      canRun: true,
      canRunTimer: 0,
      canJump: true,
      canJumpTimer: 0,
      hurt: false,
      resurrecting: false,
      resurrectTimer: 0,
      resurrectTime: 1000,
      resurrectStep: 1000,
      deadTimer: 0,
      deadTime: 1000,
      deadStep: 0,
      swinging: false,
      swingingTime: 0,
      shooting: false,
      shootingTime: 0,
      postShooting: false,
      postShootTimer: 0,
      shootRefreshing: false,
      shootRefreshTimer: 0,
      shootRefreshTime: 3000
    }

    this.prevState = {
      jump: true,
      melee: true,
      shoot: true,
      flipX: true,
      blockedDown: true
    }

    this.body.allowGravity = true
    this.alive = true

    this.clearTint()

    if (killed) {
      this.anims.resume()
      this.state.resurrecting = true
      this.state.resurrectTimer = this.state.resurrectTime
    }

    // should always face right in this game.
    this.flipX = true

    if (this.scene.hud) {
      this.scene.hud.updateLoader({ shootVal: 0, reloadVal: 1 })
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
      shoot: keys.shoot.isDown
    }

    const holds = {
      left: keys.left.timeDown,
      right: keys.right.timeDown,
      up: keys.up.timeDown,
      down: keys.down.timeDown,
      jump: keys.jump.timeDown,
      shoot: keys.shoot.timeDown,
      melee: keys.melee.timeDown
    }

    if (!this.alive) {
      this.body.setAcceleration(0)
      this.body.setVelocity(0)

      if (this.state.deadTimer > 0) {
        this.state.deadTimer -= delta
        this.state.deadStep++

        // LATER: quickflash for different times?
        const tint = this.state.deadStep % hurtFlash.length
        this.setTint(hurtFlash[tint])
      } else if (this.state.deadTimer < 0) {
        if (this.lives > 0) {
          this.resurrect()
        }
      }
    } else {
      let vel = 0

      if (input.melee && !this.prevState.melee) {
        this.swing()
      }

      if (input.shoot && !this.prevState.shoot) {
        if (this.state.shootRefreshing) {
          // TODO: add losing sound
        } else {
          this.shoot()
        }
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

      if (!this.body.blocked.down && this.prevState.blockedDown && !this.jumping) {
        this.jumps++
      }

      if (this.body.blocked.down) {
        this.jumpTime = 0
        this.jumps = 0
        this.jumping = false
      }

      if (!this.state.shooting && !this.state.postShooting &&
        !(this.state.swinging && this.state.swingingTime < this.melee.swingDone)) {
        // TODO: combine these
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

      if (!this.scene.gameIsOver) {
        this.anims.play(`${this.name}-${this.animation}`, true)
      }
    }

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

    if (this.state.resurrecting) {
      if (this.state.resurrectTimer > 0) {
        this.state.resurrectTimer -= delta
        this.state.resurrectStep++

        // LATER: quickflash for different times?
        const alpha = this.state.resurrectStep % visibleFlash.length
        this.setVisible(visibleFlash[alpha])
      } else if (this.state.resurrectTimer < 0) {
        this.state.resurrecting = false
        this.state.resurrectTimer = 0
        this.setVisible(true)
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
        this.scene.hud.updateLoader({
          shootVal: this.state.shootingTime / this.projConfig.maxHoldTime,
          reloadVal: 1
        })

        this.state.shootingTime += delta
      } else {
        const proj = this.scene.projectiles.get()

        let vel = this.state.shootingTime / this.projConfig.maxHoldTime
        if (vel > 1) {
          vel = 1
        }

        if (vel < 0.25) {
          vel = 0.25
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
        this.state.postShootingTimer = this.projConfig.fireTime
        this.state.shootRefreshing = true
        this.state.shootRefreshTimer = this.state.shootRefreshTime

        this.scene.hud.updateLoader({ reloadVal: 0, shootVal: 0 })
      }
    }

    if (this.state.postShooting) {
      if (this.state.postShootingTimer > 0) {
        this.state.postShootingTimer -= delta
      } else {
        this.state.postShooting = false
        this.state.postShootingTimer = 0
      }
    }

    if (this.state.shootRefreshing) {
      this.scene.hud.updateLoader({
        reloadVal: 1 - (this.state.shootRefreshTimer / this.state.shootRefreshTime)
      })

      if (this.state.shootRefreshTimer > 0) {
        this.state.shootRefreshTimer -= delta
      } else {
        this.state.shootRefreshing = false
        this.state.shootRefreshTimer = 0
      }
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
    if (!this.state.shooting && !this.state.shooting && !this.state.postShooting) {
      this.state.swinging = true
    }
  }

  shoot () {
    if (!this.state.swinging && !this.state.shooting && !this.state.postShooting) {
      this.state.shooting = true
    }
  }

  kill () {
    console.log('i\'m dead')
    this.alive = false
    this.body.allowGravity = false
    this.body.setVelocity(0, 0)
    this.anims.pause()
    this.state.deadTimer = this.state.deadTime
    if (this.state.swinging) {
      this.melee.cancel()
    }
    // TODO: check here for lives
    this.lives--
    this.scene.hud.updateLives(this.lives)
    if (this.lives === 0) {
      this.scene.gameOver()
    }
  }

  hit () {
    // from projectile
    this.kill()
  }

  resurrect () {
    this.x = this.scene.roomLeft + 8
    this.y = 164
    this.startingState(true)
  }
}

export default Player
