import Bluebird from 'bluebird'

import {
  FollowUpStorage
} from '../../storage'


const CheckInterval = 7 * 24 * 60 * 60 * 1000


let perform = async ({ userID }, callback) => {
  // 1. Check if user have unrated follow ups

  let unratedFollowUpsCount = await FollowUpStorage.count('unratedForUser', { userID })

  if (unratedFollowUpsCount > 0) return callback()

  callback()
}


let performAsync = Bluebird.promisify(perform)


export default {
  perform: (payload, callback) =>
    callback instanceof Function
      ? perform(payload, callback)
      : performAsync(payload)
}
