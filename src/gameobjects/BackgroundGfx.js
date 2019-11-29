const MAX_START = 960
const END = -100
const MAX_DEPTH = -50
const MAX_HEIGHT = 220

class BackgroundGfx {
  constructor ({ scene }) {
    this.scene = scene

    this.particles = []

    for (let i = 0; i < 50; i++) {
      let particle = this.scene.add.sprite(
        Math.random() * MAX_START,
        Math.random() * MAX_HEIGHT,
        'white-particle-small'
      )

      this.scene.physics.world.enable(particle)
      this.scene.add.existing(particle)

      particle.setAlpha(0.5)
        .setScrollFactor(0.3)
      particle.body.setAllowGravity(false)
        .setVelocity(Math.random() * -150 - 50, Math.random() * 40 - 13)

      this.particles.push(particle)
    }

    for (let i = 0; i < 25; i++) {
      let particle = this.scene.add.sprite(
        Math.random() * MAX_START,
        Math.random() * MAX_HEIGHT,
        'white-particle-medium'
      )

      this.scene.physics.world.enable(particle)
      this.scene.add.existing(particle)

      particle.setAlpha(0.5)
        .setScrollFactor(0.3)
      particle.body.setAllowGravity(false)
        .setVelocity(Math.random() * -100 - 50, Math.random() * 20 - 7)

      this.particles.push(particle) 
    }
  }

  update () {
    for (var i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i]

      if (particle.x < END) {
        particle.x = MAX_START
      }

      if (particle.y < MAX_DEPTH) {
        particle.y = MAX_HEIGHT
      }

      if (particle.y > MAX_HEIGHT) {
        particle.y = MAX_DEPTH
      }
    }
  }
}

export default BackgroundGfx
