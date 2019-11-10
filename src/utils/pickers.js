import HoppingPest from '../actors/HoppingPest'

export const enemyPicker = (type, payload) => {
  switch (type) {
    case 'hopper-purple':
      return new HoppingPest(payload)
    default:
      return null
  }
}
