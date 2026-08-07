import type { LocationInfo } from '../types'

export function getCurrentLocation(
  options?: PositionOptions,
): Promise<LocationInfo | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          name: 'ของคุณ',
          admin: 'ตำแหน่งปัจจุบัน',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => resolve(null),
      options,
    )
  })
}
