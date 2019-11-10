import { GameObjects } from 'phaser'

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

    // TODO: config.possession || 'player'
    this.possession = 'player'
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

      if (this.possession === 'player') {
        this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.hurtEnemy)
      } else if (this.possession === 'opponent') {
        this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
      }
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

      if (this.possession === 'player') {
        this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.hurtEnemy)
      } else if (this.possession === 'opponent') {
        this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
      }
      if (!this.soundPlayed) {
        this.soundPlayed = true
        // this.scene.sound.playAudioSprite('sfx', 'sword-swing')
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

      if (this.possession === 'player') {
        this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.hurtEnemy)
      } else if (this.possession === 'enemy') {
        // LATER: remove this if statement, make it all one.
        this.scene.physics.world.overlap(this, this.scene.player, this.hurtPlayer)
      }

      // TODO: add all other layers.
      this.scene.physics.world.overlap(this, this.scene.groundLayer, this.cancelSwing)
    }

    return this.minimumSwingComplete
  }

  hurtEnemy (melee, enemy) {
    const swingComplete = melee.minimumSwingComplete
    if (!enemy.state.hurt) {
      const damage = swingComplete ? melee.damage : melee.damage / 2

      let dir = 0
      if (melee.direction === 'left') {
        dir = -1
      } else if (melee.direction === 'right') {
        dir = 1
      } else {
        // TODO: Remove
        alert('shoouldn\'t be here')
      }

      console.log(melee.blowback * dir)

      enemy.body.setVelocity(
        melee.blowback * dir,
        melee.blowback * -2
      )

      enemy.hurt(damage)

      console.log(enemy.hitPoints)
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
    this.visible = false
    this.x = -10
    this.y = -10
    this.body.setVelocity(0, 0)
  }

  // LATER:
  // implement a hurtPlayer() function if there needs to be differences in hurtEnemy
}

export default Melee
