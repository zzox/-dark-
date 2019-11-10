export const loader = ({ items }) => {
  // this function needs to be called with bind(this)

  items.map((item) => {
    // may not need to item type because they'll all be spritesheets.
    // e.g. this.load.spritesheet('player', 'assets/images/spritesheets/player.png', SIXTEEN_EXTRUDED_TILESET)
    switch (item.type) {
      case 'spritesheet':
        this.load(item.name, item.dir, sizePicker(item.size))
    }
  })
}

const sizePicker = () => {
  // return the const
}
