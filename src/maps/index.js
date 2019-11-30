const horizontalLine = (fromX, toX, y) => {
  // add error handlers here:
  // max width = 60, max width = 34;
  const items = []

  for (let i = fromX; i <= toX; i++) {
    items.push({ x: i, y })
  }

  return items
}

const verticalLine = (fromY, toY, x) => {
  const items = []

  for (let i = fromY; i <= toY; i++) {
    items.push({ x, y: i })
  }

  return items
}

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

const room = [
  ...flatLine,
  ...verticalLine(0, 17, 0),
  ...verticalLine(0, 17, 39)
]

const smallPlats = [
  ...horizontalLine(0, 5, 21),
  ...horizontalLine(21, 22, 21),
  ...horizontalLine(33, 39, 21)
]

const roomAndChannel = [
  ...flatLine,
  ...verticalLine(5, 20, 36),
  ...verticalLine(0, 17, 39),
  ...horizontalLine(6, 8, 17),
  ...horizontalLine(15, 17, 12),
  ...horizontalLine(23, 25, 8)
]

export const the = {
  items: [...flatLine]
}

export const world = {
  items: [...raisedMiddle]
}

// put auto shooter here?
export const is = {
  autos: [
    {
      pos: { x: 20, y: 21.5 },
      dir: 'up'
    }
  ],
  items: [
    ...horizontalLine(0, 18, 21),
    ...horizontalLine(21, 39, 21)
  ]
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
    }
  ],
  items: [...raisedMiddle]
}

export const wont = {
  autos: [
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

export const why = {
  autos: [
    {
      pos: { x: 0, y: -1 },
      dir: 'down-right'
    },
    {
      pos: { x: 39, y: -1 },
      dir: 'down-left'
    }
  ],
  items: [...room]
}

export const it = {
  enemies: [
    {
      pos: { x: 39.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...roomAndChannel]
}

export const so = {
  enemies: [
    {
      pos: { x: 9, y: 17 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 29, y: 17 },
      type: 'hopper-purple'
    }
  ],
  items: [
    ...horizontalLine(0, 12, 17),
    ...horizontalLine(8, 31, 12),
    ...horizontalLine(27, 39, 17),
    ...verticalLine(12, 20, 19),
    ...room
  ]
}

export const hard = {
  items: [...smallPlats]
}

export const now = {
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

export const only = {
  enemies: [
    {
      pos: { x: 9, y: 17 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 20, y: 12 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 29, y: 17 },
      type: 'hopper-purple'
    }
  ],
  items: [
    ...horizontalLine(0, 12, 17),
    ...horizontalLine(8, 31, 12),
    ...horizontalLine(27, 39, 17),
    ...verticalLine(12, 20, 19),
    ...room
  ]
}

export const start = {
  autos: [
    {
      pos: { x: 26, y: 17.5 },
      dir: 'up'
    },
    {
      pos: { x: 28, y: 17.5 },
      dir: 'up',
      delay: 50
    }
  ],
  items: [...raisedMiddle]
}

export const beginning = {
  autos: [
    {
      pos: { x: 13, y: 17.5 },
      dir: 'up'
    },
    {
      pos: { x: 15, y: 17.5 },
      dir: 'up'
    },  ],
  items: [...raisedMiddle]
}

export const we = {
  enemies: [
    {
      pos: { x: 23, y: 20 },
      type: 'shooter-green'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'shooter-green'
    }
  ],
  items: [...middlePlatform]
}

export const can = {
  autos: [
    {
      pos: { x: 11, y: 24.5 },
      dir: 'up'
    },
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 125
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 375
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 500
    }
  ],
  items: [...middlePlatform]
}

export const over = {
  enemies: [
    {
      pos: { x: 34.5, y: 20 },
      type: 'shooter-green'
    }
  ],
  items: [...smallPlats]
}

export const come = {
  enemies: [
    {
      pos: { x: 35.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...smallPlats]
}

export const hopefully = {
  autos: [
    {
      pos: { x: 0, y: -1 },
      dir: 'down-right'
    },
    {
      pos: { x: 39, y: -1 },
      dir: 'down-left',
      delay: 25
    },
    {
      pos: { x: 13, y: -1 },
      dir: 'down',
      delay: 50
    },
    {
      pos: { x: 27, y: -1 },
      dir: 'down',
      delay: 75
    }
  ],
  items: [...room]
}

export const perish = {
  enemies: [
    {
      pos: { x: 23, y: 20 },
      type: 'shooter-green'
    },
    {
      pos: { x: 34.5, y: 20 },
      type: 'shooter-green'
    }
  ],
  autos: [
    {
      pos: { x: 11, y: 24.5 },
      dir: 'up'
    },
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 125
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 375
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 500
    }
  ],
  items: [...middlePlatform]
}

export const slow = {
  autos: [
    {
      pos: { x: 20, y: 21.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 23, y: 21.5 },
      dir: 'up-right'
    },
  ],
  items: [...smallPlats]
}

export const definitely = {
  autos: [
    {
      pos: { x: 11, y: 24.5 },
      dir: 'up'
    },
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 125
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 375
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 500
    }
  ],
  items: [...smallPlats]
}

export const a = {
  enemies: [
    {
      pos: { x: 16, y: 12 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 39.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...roomAndChannel]
}

export const time = {
  autos: [
    {
      pos: { x: 25, y: 17.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 28, y: 17.5 },
      dir: 'up-right'
    }
  ],
  items: [
    ...horizontalLine(0, 5, 21),
    ...horizontalLine(13, 14, 17),
    ...horizontalLine(26, 27, 17),
    ...horizontalLine(34, 39, 21)
  ]
}

export const needing = {
  enemies: [
    {
      pos: { x: 9, y: 17 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 14, y: 12 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 20, y: 12 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 26, y: 12 },
      type: 'hopper-purple'
    },
    {
      pos: { x: 29, y: 17 },
      type: 'hopper-purple'
    }
  ],
  items: [
    ...horizontalLine(0, 12, 17),
    ...horizontalLine(8, 31, 12),
    ...horizontalLine(27, 39, 17),
    ...verticalLine(12, 20, 19),
    ...room
  ]
}

export const prayer = {
  autos: [
    {
      pos: { x: 11, y: 24.5 },
      dir: 'up'
    },
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 100
    },
    {
      pos: { x: 15, y: 24.5 },
      dir: 'up',
      delay: 200
    },
    {
      pos: { x: 17, y: 24.5 },
      dir: 'up',
      delay: 300
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 400
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 500
    },
    {
      pos: { x: 30, y: 24.5 },
      dir: 'up',
      delay: 600
    }
  ],
  items: [...smallPlats]
}

export const salvation = {
  autos: [
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 100
    },
    {
      pos: { x: 15, y: 24.5 },
      dir: 'up',
      delay: 200
    },
    {
      pos: { x: 17, y: 24.5 },
      dir: 'up',
      delay: 300
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 400
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 500
    },
    {
      pos: { x: 30, y: 24.5 },
      dir: 'up',
      delay: 600
    },
    {
      pos: { x: 32, y: 24.5 },
      dir: 'up',
      delay: 700
    }
  ],
  items: [...smallPlats]
}

export const you = {
  enemies: [
    {
      pos: { x: 16, y: 12 },
      type: 'shooter-green'
    },
    {
      pos: { x: 39.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...roomAndChannel]
}

export const help = {
  autos: [
    {
      pos: { x: 12, y: 17.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 15, y: 17.5 },
      dir: 'up-right'
    },
    {
      pos: { x: 25, y: 17.5 },
      dir: 'up-left'
    },
    {
      pos: { x: 28, y: 17.5 },
      dir: 'up-right'
    }
  ],
  items: [
    ...horizontalLine(0, 5, 21),
    ...horizontalLine(13, 14, 17),
    ...horizontalLine(26, 27, 17),
    ...horizontalLine(34, 39, 21)
  ]
}

export const me = {
  autos: [
    {
      pos: { x: 9, y: 24.5 },
      dir: 'up'
    },
    {
      pos: { x: 11, y: 24.5 },
      dir: 'up',
      delay: 100
    },
    {
      pos: { x: 13, y: 24.5 },
      dir: 'up',
      delay: 200
    },
    {
      pos: { x: 15, y: 24.5 },
      dir: 'up',
      delay: 300
    },
    {
      pos: { x: 17, y: 24.5 },
      dir: 'up',
      delay: 400
    },
    {
      pos: { x: 19, y: 24.5 },
      dir: 'up',
      delay: 500
    },
    {
      pos: { x: 26, y: 24.5 },
      dir: 'up',
      delay: 600
    },
    {
      pos: { x: 28, y: 24.5 },
      dir: 'up',
      delay: 700
    },
    {
      pos: { x: 30, y: 24.5 },
      dir: 'up',
      delay: 800
    },
    {
      pos: { x: 32, y: 24.5 },
      dir: 'up',
      delay: 900
    }
  ],
  items: [...smallPlats]
}

export const up = {
  enemies: [
    {
      pos: { x: 16, y: 12 },
      type: 'shooter-green'
    },
    {
      pos: { x: 39.5, y: 20 },
      type: 'hopper-purple'
    }
  ],
  items: [...roomAndChannel]
}

export const run = {
  autos: [
    {
      pos: { x: 0, y: -1 },
      dir: 'down-right'
    },
    {
      pos: { x: 39, y: -1 },
      dir: 'down-left',
      delay: 25
    },
    {
      pos: { x: 13, y: -1 },
      dir: 'down',
      delay: 50
    },
    {
      pos: { x: 15, y: -1 },
      dir: 'down',
      delay: 100
    },
    {
      pos: { x: 17, y: -1 },
      dir: 'down',
      delay: 150
    },
    {
      pos: { x: 19, y: -1 },
      dir: 'down',
      delay: 200
    },
    {
      pos: { x: 23, y: -1 },
      dir: 'down',
      delay: 225
    },
    {
      pos: { x: 25, y: -1 },
      dir: 'down',
      delay: 175
    },
    {
      pos: { x: 27, y: -1 },
      dir: 'down',
      delay: 125
    }
  ],
  items: [...room]
}

export const fast = {
  items: [...room]
}