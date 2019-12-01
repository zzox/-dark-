import { GameObjects } from 'phaser'
import Melee from '../gameobjects/Melee'
import {
  hurtFlash,
  quickHurtFlash,
  visibleFlash,
  quickVisibleFlash
} from './helpers'

const MAX_DEGREE = 90
const MAX_AIMER_DISTANCE = 12
const AIMER_INC = 2
const LOW_VOL = { volume: 0.2 }
const MED_VOL = { volume: 0.35 }
const HI_VOL = { volume: 0.6 }

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

    this.meleeName = 'wand'
    this.melee = new Melee({
      owner: this,
      scene: this.scene,
      x: this.x,
      y: this.y
    })

    this.projName = 'ball'
    this.projConfig = this.scene.cache.json.entries.entries.projectiles[this.projName]

    this.aimer = this.scene.add.sprite(this.x + 8, this.y - 8, 'aimer')
    scene.physics.world.enable(this.aimer)
    this.aimer.body.setAllowGravity(false)
      .setSize(3, 3)
      .setOffset(1, 1)

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
      shootRefreshTime: 3000,
      aimerDegree: 45,
      aimerHideTimer: 0,
      aimerHideTime: 1500
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

      let udVel = 0
      if (input.up) {
        udVel = -1
      }

      if (input.down) {
        udVel = 1
      }

      if (input.down && input.up) {
        if (holds.up > holds.down) {
          udVel = 1
        } else {
          udVel = -1
        }
      }

      if (udVel === -1) {
        this.state.aimerDegree += AIMER_INC

        if (this.state.aimerDegree > MAX_DEGREE) {
          this.state.aimerDegree = MAX_DEGREE
        }

        this.state.aimerHideTimer = this.state.aimerHideTime
        this.aimer.setVisible(true)
      }

      if (udVel === 1) {
        this.state.aimerDegree -= AIMER_INC

        if (this.state.aimerDegree < 0) {
          this.state.aimerDegree = 0
        }

        this.state.aimerHideTimer = this.state.aimerHideTime
        this.aimer.setVisible(true)
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

        if (!this.prevState.blockedDown) {
          this.scene.sound.playAudioSprite('sfx', 'player-land', LOW_VOL)
        }
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
            if (this.jumps === 0) {
              this.scene.sound.playAudioSprite('sfx', 'player-jump', MED_VOL)
            } else {
              this.scene.sound.playAudioSprite('sfx', 'player-double-jump', MED_VOL)
            }
            this.jumps++
          } else {
            this.body.setVelocityY(-this.jumpVelocity / 1.5)
          }
        }
      }

      this.run(vel)

      this.updateAnimations()

      const xDist = MAX_AIMER_DISTANCE * Math.cos(this.state.aimerDegree * Math.PI / 180)
      const yDist = MAX_AIMER_DISTANCE * Math.sin(this.state.aimerDegree * Math.PI / 180)
      if (this.flipX) {
        this.aimer.x = this.x + xDist + 2
      } else {
        this.aimer.x = this.x - xDist
      }
      this.aimer.y = this.y - yDist

      this.aimer.body.velocity.x = this.body.velocity.x
      this.aimer.body.velocity.y = this.body.velocity.y

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
      if (input.shoot && this.state.shootingTime < this.projConfig.maxHoldTime) {
        this.scene.hud.updateLoader({
          shootVal: this.state.shootingTime / this.projConfig.maxHoldTime,
          reloadVal: 1
        })

        this.state.shootingTime += delta
        this.aimer.setVisible(true)
        this.state.aimerHideTimer = this.state.aimerHideTime
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
          xVel: vel * Math.cos(this.state.aimerDegree * Math.PI / 180) * this.projConfig.velocity,
          yVel: -vel * Math.sin(this.state.aimerDegree * Math.PI / 180) * this.projConfig.velocity,
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

        this.scene.sound.playAudioSprite('sfx', 'player-throw', HI_VOL)

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
      } else if (this.state.canRunTimer <= 0) {
        this.state.canRun = true
      }
    }

    if (!this.state.canJump) {
      if (this.state.canJumpTimer > 0) {
        this.state.canJumpTimer -= delta
      } else if (this.state.canJumpTimer <= 0) {
        this.state.canJump = true
      }
    }

    if (this.aimer.visible) {
      if (this.state.aimerHideTimer > 0) {
        this.state.aimerHideTimer -= delta
      } else if (this.state.aimerHideTimer <= 0) {
        this.aimer.setVisible(false)
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
      this.scene.sound.playAudioSprite('sfx', 'player-hold', LOW_VOL)
    }
  }

  kill () {
    this.alive = false
    this.body.allowGravity = false
    this.body.setVelocity(0, 0)
    this.anims.pause()
    this.aimer.setVisible(false)

    this.state.deadTimer = this.state.deadTime

    if (this.state.swinging) {
      this.melee.cancel()
    }

    this.lives--
    this.scene.hud.updateLives(this.lives)
    if (this.lives === 0) {
      this.scene.gameOver()
    }

    this.scene.sound.playAudioSprite('sfx', 'player-hurt', HI_VOL)
  }

  killedPest () {
    this.lives++
    this.scene.hud.updateLives(this.lives)
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
