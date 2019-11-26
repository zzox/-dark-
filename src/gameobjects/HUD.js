const MAX_LIVES_DISPLAY = 5
const LIFE_PADDING = 2
const RELOAD_COLOR = 0xd59cfc
const SHOOT_COLOR = 0xcf3c71

class HUD {
  constructor ({ scene, lives }) {
    this.scene = scene
    this.lives = lives || 3 // <-- remove poor mans if

    this.liveSprites = this.scene.add.group()
    this.lifeAmount = this.scene.add.bitmapText(20, 2, 'font', '', 16)
      .setScrollFactor(0)
      .setVisible(false)
    this.lifeNumSprite = this.scene.add.image(10, 8, 'life')
      .setScrollFactor(0)
      .setVisible(false)

    this.drawLives()

    this.reloadBar = this.scene.add.graphics()
      .fillStyle(RELOAD_COLOR)
      .fillRect(206, 4, 110, 16)
      .setScrollFactor(0)

    this.shootBar = this.scene.add.graphics()
      .fillStyle(SHOOT_COLOR)
      .setScrollFactor(0)

    this.scene.add.image(261, 12, 'bar')
      .setScrollFactor(0)

    this.scene.add.image(261, 12, 'bar-shine')
      .setScrollFactor(0)
      .setAlpha(0.4)
  }

  drawLives () {
    this.liveSprites.clear(true, true)

    if (this.lives > MAX_LIVES_DISPLAY) {
      this.lifeNumSprite.setVisible(true)
      this.lifeAmount.setVisible(true)
      this.lifeAmount.text = `x${this.lives}`
    } else {
      this.lifeAmount.setVisible(false)
      this.lifeNumSprite.setVisible(false)

      for (let i = 0; i < this.lives; i++) {
        const spr = this.scene.add.image(i * 18 + 10, 8, 'life')
          .setScrollFactor(0)

        this.liveSprites.add(spr)
      }
    }
  }

  updateLives (lives) {
    this.lives = lives
    this.drawLives()
  }

  updateLoader ({ reloadVal, shootVal }) {
    if (reloadVal > 1) {
      reloadVal = 1
    }

    if (!reloadVal || reloadVal < 0) {
      reloadVal = 0
    }

    if (shootVal > 1) {
      shootVal = 1
    }

    if (!shootVal || shootVal < 0) {
      shootVal = 0
    }

    this.reloadBar
      .clear()
      .fillStyle(RELOAD_COLOR)
      .fillRect(206, 4, 110 * reloadVal, 16)

    this.shootBar
      .clear()
      .fillStyle(SHOOT_COLOR)
      .fillRect(206, 4, 110 * shootVal, 16)
  }
}

export default HUD
