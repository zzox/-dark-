export const createMaster = (finished = []) => {
  window.master = {
    finished: [...finished]
  }
}

export const completedWorld = (world) => {
  // TODO: Remove and check if it's already completed
  if (!window.master) {
    throw new Error('Master not initialized.')
  }

  window.master.finished.push(world)
}

export const getWorlds = () => {
  if (!window.master) {
    throw new Error('Master not initialized.')
  }

  return window.master
}
