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

const raisedMiddle = [
  ...horizontalLine(0, 9, 21),
  ...horizontalLine(16, 24, 17),
  ...horizontalLine(30, 39, 21)
]

export const the = {
  items: [...flatLine]
}

export const world = {
  items: [...raisedMiddle]
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

export const what = {
  autos: [
    {
      pos: { x: 20, y: 21.5 },
      dir: 'up'
    },
    {
      pos: { x: 26, y: 21.5 },
      dir: 'up',
      delay: 50
    }
  ],
  items: [
    ...horizontalLine(0, 18, 21),
    ...horizontalLine(21, 24, 21),
    ...horizontalLine(27, 39, 21)
  ]
}

export const gone = {
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

// make on inner one outer shooting?
export const will = {
  autos: [
    {
      pos: { x: 15, y: 17.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 25, y: 17.5 },
      dir: 'up-right',
      delay: 50
    }
  ],
  items: [...raisedMiddle]
}

export const wont = {
  autos: [
    {
      pos: { x: 15, y: 17.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 25, y: 17.5 },
      dir: 'up-right',
      delay: 50
    }
  ],
  items: [...raisedMiddle]
}

export const recover = {
  items: [...middlePlatform]
}
