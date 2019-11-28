import store from 'store'

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

  if (!window.master.finished.includes(world)) {
    window.master.finished.push(world)
  }

  saveMaster(window.master.finished)
}

export const getWorlds = () => {
  if (!window.master) {
    throw new Error('Master not initialized.')
  }

  return window.master
}

export const saveMaster = (finished) => store.set('dark-session', { finished })
