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
  enemies: [
    {
      pos: { x: 20.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...middlePlatform]
}

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
  items: [...middlePlatform]
}

export const maybe = {
  items: [...middlePlatform]
}

export const surely = {
  items: [...middlePlatform]
}

export const ending = {
  items: [
    ...horizontalLine(0, 39, 21)
  ]
}
