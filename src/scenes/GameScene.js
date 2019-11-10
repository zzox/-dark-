import { Scene, Input, Geom } from 'phaser'
import Player from '../actors/Player'
import Projectile from '../gameobjects/Projectile'
import * as maps from '../maps'
import { enemyPicker } from '../utils/pickers'

// TODO: move to consts file
const TEXT_SIZE = 16
const EIGHT_TILESET = { frameWidth: 8, frameHeight: 8 }
const SIXTEEN_EXTRUDED_TILESET = { frameWidth: 16, frameHeight: 16, spacing: 2, margin: 1 }
const MAP_PIXEL_WIDTH = 320
const MAP_TILE_WIDTH = 40
const TILE_SIZE = 8
const ROOM_TOP = 4
const ROOM_EDGE = 8
// so we collide in all sides besides the bottom.
const PHYSICS_HEIGHT = 500

class GameScene extends Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  preload () {
    this.load.spritesheet('tiles', 'assets/images/tilesets/tiles.png', EIGHT_TILESET)
    this.load.spritesheet('player', 'assets/images/spritesheets/player.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('hopper-purple', 'assets/images/spritesheets/hopper-purple.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('wand', 'assets/images/spritesheets/wand.png', SIXTEEN_EXTRUDED_TILESET)
    this.load.spritesheet('ball', 'assets/images/spritesheets/ball.png', SIXTEEN_EXTRUDED_TILESET)

    // MD:
    this.worldName = 'one'

    this.animsConfig = this.cache.json.entries.entries.animations
    this.worldConfig = this.cache.json.entries.entries.worlds[this.worldName]
    this.animsArray = ['player', 'hopper-purple', 'wand', 'ball']
  }

  create () {
    const { backgroundColor, maps } = this.worldConfig

    // ROOM STUFF
    this.roomLeft = 0
    this.roomRight = MAP_PIXEL_WIDTH
    this.currentRoom = 0
    this.totalRooms = maps.length
    this.movingRoom = false
    this.physics.world.setBounds(0, 0, MAP_PIXEL_WIDTH, PHYSICS_HEIGHT)

    let rect = new Geom.Rectangle(-10, -10, 340, 200)
    this.add.graphics({ fillStyle: { color: 0x000000 } })
      .fillRectShape(rect).setScrollFactor(0)

    rect = new Geom.Rectangle(0, 0, 320, 180)
    this.add.graphics({ fillStyle: { color: parseInt(backgroundColor) } })
      .fillRectShape(rect).setScrollFactor(0)

    this.add.bitmapText(20, 20, 'font', 'we here', 72).setAlpha(0.1)

    const map = this.make.tilemap({ width: this.totalRooms * MAP_TILE_WIDTH, height: 22, tileWidth: 8, tileHeight: 8 })
    const tiles = map.addTilesetImage('tiles', null, 8, 8)

    this.groundLayer = map.createBlankDynamicLayer('ground', 'tiles', this.roomLeft, ROOM_TOP)
      .setCollisionBetween(0, 16)

    this.player = new Player({
      scene: this,
      x: 168,
      y: 16
    })
    this.physics.world.addCollider(this.player, this.groundLayer)

    this.enemies = this.add.group()
    this.projectiles = this.add.group()
    for (let i = 0; i < 50; i++) {
      this.projectiles.add(new Projectile(this))
    }

    this.makeWorld()

    const { UP, LEFT, RIGHT, DOWN, A, S, D, Q, W, E } = Input.Keyboard.KeyCodes

    this.keys = {
      up: this.input.keyboard.addKey(UP),
      left: this.input.keyboard.addKey(LEFT),
      right: this.input.keyboard.addKey(RIGHT),
      down: this.input.keyboard.addKey(DOWN),
      jump: this.input.keyboard.addKey(A),
      melee: this.input.keyboard.addKey(S),
      shoot: this.input.keyboard.addKey(D),
      dash: this.input.keyboard.addKey(Q)
    }

    this.createAnimations()
  }

  update (time, delta) {
    this.player.update(delta, this.keys)

    // console.time('checkRoom')
    if (this.player.x > this.roomRight - ROOM_EDGE && this.currentRoom < this.totalRooms - 1 && !this.movingRoom) {
      this.moveRoom()
    }

    if (this.movingRoom) {
      this.movingRoomUpdate()
    }

    this.enemies.children.entries.map((enemy) => enemy.update(delta))

    this.projectiles.children.entries.map(projectiles => projectiles.update(time, delta))
  }

  moveRoom () {
    this.tweens.add({
      targets: this.cameras.main,
      scrollX: { from: this.roomLeft, to: this.roomRight },
      ease: 'Power1',
      duration: 666,
      repeat: 0,
      onComplete: this.movingRoomComplete.bind(this)
    })

    // remove all projectiles/enemies collidiing with world bounds
    // add a roomNumber trait to each enemy so they don;t have to be activated until a certain point.

    this.movingRoom = true
  }

  movingRoomUpdate () {
    this.physics.world.setBounds(this.cameras.main.scrollX, 0, MAP_PIXEL_WIDTH, PHYSICS_HEIGHT)
  }

  movingRoomComplete () {
    this.roomLeft = this.roomRight
    this.roomRight = this.roomRight + MAP_PIXEL_WIDTH
    this.currentRoom++
    this.movingRoom = false
  }

  createAnimations () {
    if (this.anims.anims) {
      this.anims.anims.clear()
    }

    this.animsArray.map(item => {
      let items
      const alias = this.animsConfig[item].alias

      if (alias) {
        items = this.animsConfig[alias].anims
      } else {
        items = this.animsConfig[item].anims
      }

      items.map(anim => {
        this.anims.create({
          key: `${item}-${anim.key}`,
          //                                sheet vvv
          frames: this.anims.generateFrameNumbers(item, anim.frames),
          frameRate: anim.frameRate ? anim.frameRate : 1,
          repeat: anim.repeat ? anim.repeat : -1,
          repeatDelay: anim.repeatDelay ? anim.repeatDelay : 0
        })
      })
    })
  }

  makeWorld () {
    this.worldConfig.maps.map((item, i) => {
      const selected = Math.floor(Math.random() * item.possibilities.length)

      this.makeMap(maps[item.possibilities[selected]], i)
    })
  }

  makeMap (room, index) {
    const { items, enemies } = room

    const xDifferential = index * MAP_TILE_WIDTH
    items.map(item => this.groundLayer.putTileAt(0, item.x + xDifferential, item.y))

    if (enemies) {
      enemies.map((enemy) => {
        const enemyType = enemy.types[Math.floor(Math.random() * enemy.types.length)]

        const newEnemy = enemyPicker(
          enemyType,
          {
            scene: this,
            x: enemy.pos.x * TILE_SIZE + xDifferential,
            y: enemy.pos.y * TILE_SIZE
          }
        )
        // add room to their payload

        this.enemies.add(newEnemy)
      })
    }

    this.physics.world.addCollider(this.enemies, this.groundLayer)
  }
}

export default GameScene
