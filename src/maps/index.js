const horizontalLine = (fromX, toX, y) => {
  // add error handlers here:
  // max width = 60, max width = 34;
  const items = []

  for (let i = fromX; i <= toX; i++) {
    items.push({ x: i, y })
  }

  return items
}

// TODO: seprate items from text, spacing, centering and sizing of background text

const flatLine = [...horizontalLine(0, 39, 21)]

const middlePlatform = [
  ...horizontalLine(0, 9, 21),
  ...horizontalLine(16, 24, 21),
  ...horizontalLine(30, 39, 21)
]

export const the = {
  items: [...flatLine]
}

export const world = {
  items: [
    ...horizontalLine(0, 9, 21),
    ...horizontalLine(16, 24, 17),
    ...horizontalLine(30, 39, 21)
  ]
}

// put auto shooter here?
export const is = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...flatLine]
}

export const maybe = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...flatLine]
}

export const surely = {
  enemies: [
    {
      pos: { x: 34.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...flatLine]
}

export const ending = {
  items: [
    ...horizontalLine(0, 39, 21)
  ]
}

export const world2 = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...middlePlatform]
}

export const is2 = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...middlePlatform]
}

export const maybe2 = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'shooter-green'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'shooter-green'
    }
  ],
  items: [...middlePlatform]
}

export const surely2 = {
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'shooter-green'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'shooter-green'
    }
  ],
  items: [...middlePlatform]
}
