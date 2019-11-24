const createMaster = () => {
  window.master = {
    finished: []
  }
}

const const completedWorld = (world) => {
  // TODO: Remove
  if (!window.master) {
    throw new Error('Master not initialized.')
  }

  window.master.finished.push(world)
}

const getWorlds = () => {
  if (!window.master) {
    throw new Error('Master not initialized.')
  }

  return window.master
}
