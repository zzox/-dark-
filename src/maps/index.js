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
export const the = {
  items: [...horizontalLine(0, 38, 21)]
}

export const world = {
  enemies: [
    {
      pos: { x: 16, y: 16 },
      types: ['hopper-purple']
    }
  ],
  items: [
    ...horizontalLine(0, 8, 21),
    ...horizontalLine(12, 16, 21),
    ...horizontalLine(22, 38, 21)
  ]
}

export const is = {
  items: [
    ...horizontalLine(0, 8, 21),
    ...horizontalLine(12, 16, 21),
    ...horizontalLine(22, 38, 21)
  ]
}

export const maybe = {
  items: [
    ...horizontalLine(0, 8, 21),
    ...horizontalLine(12, 16, 21),
    ...horizontalLine(22, 38, 21)
  ]
}

export const surely = {
  items: [
    ...horizontalLine(0, 8, 21),
    ...horizontalLine(12, 16, 21),
    ...horizontalLine(22, 38, 21)
  ]
}

export const ending = {
  items: [
    ...horizontalLine(0, 38, 21)
  ]
}
