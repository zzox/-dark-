import { GameObjects } from 'phaser'
import {
  hurtFlash,
  quickHurtFlash
} from './helpers'

const CLEAR_TINT = 0xFFFFFF

class HoppingPest extends GameObjects.Sprite {
  constructor ({ scene, x, y, roomIndex }) {
    super(scene, x, y)
    scene.physics.world.enable(this)
    scene.add.existing(this)
    // MD:
    this.name = 'hopper-purple'
    this.roomIndex = roomIndex

    // this.body.setVelocity(0, 0).setBounce(0, 0)
    this.body.setSize(16, 16)
    this.body.setOffset(0, 0)

    this.acceleration = 800
    this.body.maxVelocity.set(500)
    // this.body.drag.set(1000, 0)

    this.body.setCollideWorldBounds(true)
    this.body.setBounce(0.5, 0)

    this.minDecisionTime = 500
    this.maxDecisionTime = 1200
    this.decisionTime = this.chooseDecisionTime()
    this.decisionTimer = 0

    this.attackDistance = {
      x: 100,
      y: 100
    }

    this.attackVelocity = {
      x: 150,
      y: 300
    }

    this.alive = true
    this.hitPoints = 50
    this.damage = 30
    this.blowback = 200
    this.randomAttackChance = 0.025
    this.hurtTime = 500

    this.animation = 'bounce'

    this.state = {
      move: 'idle',
      hurt: false,
      hurtTimer: 0,
      hurtStep: 0
    }

    this.prevState = {
      moveState: 'idle'
    }
  }

  update (delta) {
    // TODO:
    if (this.room !== this.scene.currentRoom) {
      return
    }

    // states
    if (this.decisionTimer > this.decisionTime) {
      this.makeDecision()
    } else {
      this.decisionTimer += delta
    }

    this.updateStates(delta)

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
        this.state.hurt = false
        this.state.hurtStep = 0
        this.setTint(CLEAR_TINT)
        this.state.healthIncTimer = 0
      }
    }

    switch (this.state.move) {
      case 'attack':
        if (this.state.move === 'attack' && this.prevState.moveState !== 'attack') {
          // jump in dir

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
      default:
        break
    }
  }

  makeDecision () {
    // if player is close, attack.
    // if not, then just chill

    const player = this.scene.player
    if ((player && this.body.blocked.down && Math.abs(player.x - this.x) < this.attackDistance.x &&
      Math.abs(player.y - this.y) < this.attackDistance.y) ||
      Math.random() < this.randomAttackChance) {
      this.state.move = 'attack'
    }

    this.decisionTime = this.chooseDecisionTime()
    this.decisionTimer = 0
  }

  // TODO: make parent
  chooseDecisionTime () {
    return Math.random() * (this.maxDecisionTime - this.minDecisionTime) + this.minDecisionTime
  }

  hurt (damage) {
    // TODO: queue hitpoints numbers here
    this.hitPoints = this.hitPoints - damage
    this.state.hurt = true
    this.state.hurtTimer = this.hurtTime

    if (this.hitPoints <= 0) {
      this.alive = false
      this.scene.enemiesDestroyed++
      // TODO: fade out or something
      this.destroy()
    }
  }

  activate () {
    this.active = true
  }
}

export default HoppingPest
