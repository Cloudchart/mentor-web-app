import {
  UserStorage
} from '../storage'

let perform = async () => {
  let users = await UserStorage.loadAll('all')
  return users.map(user => ({
    name: 'UpdateUserInsightsQueue',
    payload: { user_id: user.id }
  }))
}

export default {
  immediate:  true,
  repeatable: true,
  delay:      1 * 60 * 1000,
  perform
}
