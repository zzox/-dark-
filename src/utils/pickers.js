import HoppingPest from '../actors/HoppingPest'
import ShootingPest from '../actors/ShootingPest'

export const enemyPicker = (type, payload) => {
  switch (type) {
    case 'hopper-purple':
      return new HoppingPest(payload)
    case 'shooter-green':
      return new ShootingPest(payload)
    default:
      return null
  }
}
