import { Scene, Input, Geom } from 'phaser'
import Player from '../actors/Player'
import Pest from '../actors/Pest'
import Projectile from '../gameobjects/Projectile'
import AutoShooter from '../gameobjects/AutoShooter'
import * as maps from '../maps'
import HUD from '../gameobjects/HUD'
import BackgroundGfx from '../gameobjects/BackgroundGfx'
import { completedWorld } from '../utils/worldData'

// TODO: move to consts file
const TEXT_SIZE = 16
const MAP_PIXEL_WIDTH = 320
const MAP_TILE_WIDTH = 40
const TILE_SIZE = 8
const ROOM_TOP = 4
const ROOM_EDGE = 8
const ROOM_HEIGHT = 200
// so we collide in all sides besides the bottom.
const PHYSICS_HEIGHT = 500
const STARTING_LIVES = 5
const GAME_OVER_TIME = 666

class GameScene extends Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init ({ worldName }) {
    this.worldName = worldName
  }

  preload () {
    this.pestsConfig = this.cache.json.entries.entries.pests
    this.worldConfig = this.cache.json.entries.entries.worlds[this.worldName]
  }

  create () {
    this.consts()
    const { maps, background } = this.worldConfig

    // ROOM STUFF
    this.roomLeft = 0
    this.roomRight = MAP_PIXEL_WIDTH
    this.currentRoom = 0
    this.totalRooms = maps.length
    this.movingRoom = false
    this.physics.world.setBounds(0, 0, MAP_PIXEL_WIDTH, PHYSICS_HEIGHT)

    this.add.image(240, 90, background)
      .setScrollFactor(0.1, 0)

    this.bgGfx = new BackgroundGfx({ scene: this })

    const map = this.make.tilemap({ width: this.totalRooms * MAP_TILE_WIDTH, height: 22, tileWidth: 8, tileHeight: 8 })
    map.addTilesetImage('tiles', null, 8, 8)

    this.groundLayer = map.createBlankDynamicLayer('ground', 'tiles', this.roomLeft, ROOM_TOP)
      .setCollisionBetween(0, 16)

    this.player = new Player({
      scene: this,
      x: 16,
      y: 164,
      lives: STARTING_LIVES // MD:
    })
    this.physics.world.addCollider(this.player, this.groundLayer)

    this.enemies = this.add.group()
    this.projectiles = this.add.group()
    for (let i = 0; i < 50; i++) {
      this.projectiles.add(new Projectile(this))
    }
    this.autos = this.add.group()

    this.makeWorld()

    this.physics.world.addOverlap(this.player, this.enemies, this.playerOverlapEnemy)
    this.physics.world.addCollider(this.enemies, this.groundLayer)
    this.physics.world.addCollider(this.player, this.autos)
    this.physics.world.addCollider(this.enemies, this.autos)

    const { UP, LEFT, RIGHT, DOWN, A, S, D } = Input.Keyboard.KeyCodes

    this.keys = {
      up: this.input.keyboard.addKey(UP),
      left: this.input.keyboard.addKey(LEFT),
      right: this.input.keyboard.addKey(RIGHT),
      down: this.input.keyboard.addKey(DOWN),
      jump: this.input.keyboard.addKey(A),
      melee: this.input.keyboard.addKey(S),
      shoot: this.input.keyboard.addKey(D)
    }

    this.hud = new HUD({ scene: this, lives: this.player.lives }) // MD:

    this.exit = this.addExit()

    this.physics.world.addOverlap(this.player, this.exit, this.hitDoor, null, this)

    this.gameOverTimer = 0
    this.gameIsOver = false
    this.worldWon = false

    this.music = this.sound.playAudioSprite('songs', 'dark-one', { loop: true })
  }

  update (time, delta) {
    this.player.update(delta, this.keys)

    if (this.player.x > this.roomRight - ROOM_EDGE && this.currentRoom < this.totalRooms - 1 && !this.movingRoom) {
      this.moveRoom()
    }

    if (this.player.y > ROOM_HEIGHT && this.player.alive) {
      this.player.kill()
    }

    this.bgGfx.update()

    this.enemies.children.entries.map((enemy) => enemy.update(delta))
    this.projectiles.children.entries.map((projectile) => projectile.update(delta))
    this.autos.children.entries.map((auto) => auto.update(delta))

    if (this.gameIsOver) {
      if (!this.gameOverTimer) {
        if (this.worldWon) {
          this.sound.playAudioSprite('sfx', 'door', { volume: 0.5 })
        }
        this.cameras.main.fadeOut(GAME_OVER_TIME)
      }

      if (this.gameOverTimer > GAME_OVER_TIME) {
        this.pauseMusic()
        if (this.worldWon) {
          if (this.worldName === 'nine') {
            this.scene.start('Complete')
          } else {
            this.scene.start('WorldScene', { completedWorld: this.worldName })
          }
        } else {
          this.sound.playAudioSprite('sfx', 'game-over', { volume: 0.5 })
          this.scene.start('GameOver', { fromWorld: this.worldName })
        }
      } else {
        this.gameOverTimer += delta
      }
    }
  }

  playerOverlapEnemy (player, enemy) {
    if (!enemy.state.hurt && !player.state.resurrecting && player.alive && enemy.alive) {
      player.kill()
    }
  }

  moveRoom () {
    this.deactivatePests()

    this.tweens.add({
      targets: this.cameras.main,
      scrollX: { from: this.roomLeft, to: this.roomRight },
      ease: 'Power1',
      duration: 666,
      repeat: 0,
      onComplete: this.movingRoomComplete.bind(this)
    })

    this.tweens.add({
      targets: this.player,
      x: { from: this.player.x, to: this.roomRight + 4 },
      ease: 'Linear',
      duration: 666,
      repeat: 0
    })

    this.physics.pause()

    this.movingRoom = true
  }

  movingRoomComplete () {
    this.roomLeft = this.roomRight
    this.roomRight = this.roomRight + MAP_PIXEL_WIDTH
    this.currentRoom++
    this.movingRoom = false
    this.physics.world.setBounds(this.roomLeft, 0, MAP_PIXEL_WIDTH, PHYSICS_HEIGHT)
    this.activatePests()
    this.deactivateProjectiles()
    this.physics.resume()
  }

  deactivatePests () {
    this.enemies.children.entries.map(pest => pest.deactivate())
  }

  activatePests () {
    this.enemies.children.entries.map(pest => {
      if (pest.roomIndex === this.currentRoom) {
        pest.activate()
      }
    })
  }

  deactivateProjectiles () {
    this.projectiles.children.entries.map(proj => {
      if (proj.active) {
        proj.disappear()
      }
    })
  }

  makeWorld () {
    this.worldConfig.maps.map((item, i) => {
      const selected = Math.floor(Math.random() * item.possibilities.length)

      this.makeMap(maps[item.possibilities[selected]], i, item.possibilities[selected])
    })
  }

  makeMap (room, index, name) {
    const { items, enemies, autos } = room

    const xDifferential = index * MAP_TILE_WIDTH
    items.map(item =>
      this.groundLayer.putTileAt(
        item.type === 'horizontal' ? 0 : 1,
        item.x + xDifferential,
        item.y
      )
    )

    this.add.bitmapText(
      Math.floor(Math.random() * 100) + xDifferential * 8,
      Math.floor(Math.random() * 80),
      'font',
      name,
      128
    ).setAlpha(0.01)

    if (enemies) {
      enemies.map((enemy) => {
        const newEnemy = new Pest({
          scene: this,
          roomIndex: index,
          x: (enemy.pos.x + xDifferential) * TILE_SIZE,
          y: enemy.pos.y * TILE_SIZE,
          config: this.pestsConfig[enemy.type]
        })

        this.enemies.add(newEnemy)
      })
    }

    if (autos) {
      autos.map((auto) => {
        let texture = 'auto-shooter-angle'
        if (auto.dir === 'up' || auto.dir === 'down' || auto.dir === 'left' || auto.dir === 'right') {
          texture = 'auto-shooter'
        }

        const newAuto = new AutoShooter({
          scene: this,
          roomIndex: index,
          x: (auto.pos.x + xDifferential) * TILE_SIZE,
          y: auto.pos.y * TILE_SIZE,
          dir: auto.dir,
          delay: auto.delay,
          texture
        })

        this.autos.add(newAuto)
      })
    }
  }

  addExit () {
    const door = this.add.sprite((this.totalRooms - 1) * MAP_PIXEL_WIDTH + 272, 156, 'door')

    this.physics.world.enable(door)
    this.add.existing(door)

    door.body.setSize(16, 12)
      .setOffset(8, 12)
      .setAllowGravity(false)
      .setImmovable(true)

    return door
  }

  hitDoor () {
    completedWorld(this.worldName)
    this.worldWon = true
    this.gameIsOver = true
    this.player.anims.pause()
    this.physics.pause()
  }

  consts () {
    this.ROOM_HEIGHT = ROOM_HEIGHT
  }

  gameOver () {
    this.gameIsOver = true
  }

  pauseMusic () {
    let sounds = this.sound.sounds
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].key === 'songs') {
        this.sound.sounds[i].pause()
      }
    }
  }
}

export default GameScene
