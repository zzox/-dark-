import { GameObjects } from 'phaser'
import {
  hurtFlash,
  quickHurtFlash,
  deadFlash,
  quickDeadFlash
} from './helpers'

const CLEAR_TINT = 0xFFFFFF

const LOW_VOL = { volume: 0.2 }
const MED_VOL = { volume: 0.35 }
const HI_VOL = { volume: 0.6 }

class ShootingPest extends GameObjects.Sprite {
  constructor ({ scene, x, y, roomIndex, config }) {
    super(scene, x, y)
    scene.physics.world.enable(this)
    scene.add.existing(this)
    // MD:
    this.name = config.name
    this.roomIndex = roomIndex

    // this.body.setVelocity(0, 0).setBounce(0, 0)
    this.body.setSize(12, 13)
    this.body.setOffset(2, 3)

    this.acceleration = 800
    this.body.maxVelocity.set(500)
    // this.body.drag.set(1000, 0)

    // this.body.setCollideWorldBounds(true)
    this.body.setBounce(0.5, 0)

    this.minDecisionTime = 500
    this.maxDecisionTime = 1200
    this.decisionTime = this.chooseDecisionTime()
    this.decisionTimer = 0

    this.attackDistance = {
      x: config.attackDistance.x,
      y: config.attackDistance.y
    }

    this.attackVelocity = {
      x: config.attackVelocity.x,
      y: config.attackVelocity.y
    }

    this.alive = true
    this.blowback = 200
    this.lightness = 100
    this.lightnessInc = 50
    this.randomAttackChance = 0.025
    this.mainAttack = config.mainAttack

    this.state = {
      move: 'idle',
      hurt: false,
      hurtTimer: 0,
      hurtTime: 500,
      hurtStep: 0,
      deadTimer: 0,
      deadTime: 666,
      deadStep: 0,
      fired: false
    }

    this.canFire = config.canFire

    this.prevState = {
      moveState: 'idle'
    }

    this.isActive = false

    // for shooting pest
    if (this.canFire) {
      this.fireVel = {
        x: config.fireVel.x,
        y: config.fireVel.y
      }

      this.projName = config.projName
      this.projConfig = this.scene.cache.json.entries.entries.projectiles[this.projName]
    }
  }

  update (delta) {
    if (this.isActive) {
      // states
      if (this.decisionTimer > this.decisionTime) {
        this.makeDecision()
      } else {
        this.decisionTimer += delta
      }

      if (this.alive) {
        this.updateStates(delta)
      } else {
        if (this.state.deadTimer > 0) {
          this.state.deadTimer -= delta
          this.state.deadStep++

          // LATER: quickflash for different times?
          const tint = this.state.deadStep % deadFlash.length
          this.setTint(deadFlash[tint])
        } else {
          this.destroy()
          return
        }
      }
    }

    if (!this.body.velocity.x && !this.body.velocity.y) {
      this.animation = 'idle'
    } else {
      this.animation = 'attack'
    }

    this.anims.play(`${this.name}-${this.animation}`, true)

    this.prevState = {
      moveState: this.state.move,
      onGround: this.body.blocked.down
    }
  }

  updateStates (delta) {
    if (this.state.hurt) {
      if (this.state.hurtTimer > 0) {
        this.state.hurtTimer -= delta
        this.state.hurtStep++

        // LATER: quickflash for different times?
        const tint = this.state.hurtStep % hurtFlash.length
        this.setTint(hurtFlash[tint])
      } else if (this.state.hurtTimer < 0) {
        this.body.setBounce(0.5, 0)
        this.state.hurt = false
        this.state.hurtStep = 0
        this.setTint(CLEAR_TINT)
        this.state.healthIncTimer = 0
      }
    }

    if (this.y > this.scene.ROOM_HEIGHT) {
      this.hit()
    }

    switch (this.state.move) {
      case 'attack':
        if (this.state.move === 'attack' && this.prevState.moveState !== 'attack') {
          // jump in dir
          this.scene.sound.playAudioSprite('sfx', 'pest-jump', MED_VOL)

          if (this.scene.player.x < this.x) {
            this.body.setVelocity(-this.attackVelocity.x, -this.attackVelocity.y)
          } else {
            this.body.setVelocity(this.attackVelocity.x, -this.attackVelocity.y)
          }
        }

        if (this.state.move === 'attack' && this.prevState.moveState === 'attack' &&
          this.body.blocked.down) {
          this.state.move = 'idle'
        }
        break
      case 'idle':
        if (!this.state.hurt && this.body.blocked.down) {
          this.body.setVelocityX(0)
        }
        break
      case 'fire':
        if (!this.state.fired) {
          const proj = this.scene.projectiles.get()
          proj.fire({
            x: this.x,
            y: this.y,
            xVel: this.fireVel.x,
            yVel: this.fireVel.y,
            dir: this.scene.player.x < this.x ? 'left' : 'right',
            name: this.projName,
            fromActor: this.name,
            ...this.projConfig
          })
          this.state.fired = true

          this.scene.sound.playAudioSprite('sfx', 'player-throw', MED_VOL)
        }
        break
      default:
        break
    }
  }

  makeDecision () {
    if (this.canFire) {
      this.state.fired = false
    }
    // if player is close, attack.
    // if not, then just chill

    const player = this.scene.player
    if ((player && this.body.blocked.down && Math.abs(player.x - this.x) < this.attackDistance.x &&
      Math.abs(player.y - this.y) < this.attackDistance.y) ||
      Math.random() < this.randomAttackChance) {
      this.state.move = this.mainAttack
    }

    this.decisionTime = this.chooseDecisionTime()
    this.decisionTimer = 0
  }

  chooseDecisionTime () {
    return Math.random() * (this.maxDecisionTime - this.minDecisionTime) + this.minDecisionTime
  }

  hit () {
    this.scene.sound.playAudioSprite('sfx', 'pest-dead', HI_VOL)
    this.alive = false
    this.body.allowGravity = false
    this.body.setVelocity(0, 0)
    this.anims.pause()
    this.state.deadTimer = this.state.deadTime
  }

  hurt (hurtMutli = 1) {
    this.state.hurt = true
    this.state.hurtTimer = this.state.hurtTime * hurtMutli
    this.body.setBounce(0.66, 0.66)
    this.lightness += this.lightnessInc
    this.scene.sound.playAudioSprite('sfx', 'pest-hurt', MED_VOL)
  }

  activate () {
    this.body.setCollideWorldBounds(true)
    this.isActive = true
  }

  deactivate () {
    this.body.setCollideWorldBounds(false)
    this.isActive = false
  }
}

export default ShootingPest
