import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserNotificationsSettingsStorage,
} from '../../storage'

const TIME_RE = /^(0\d|1\d|2[0-3]):[0-5]\d$/

export default mutationWithClientMutationId({

  name: 'UpdateUserNotificationsSettings',

  inputFields: {
    startAt: {
      type: GraphQLString,
    },
    finishAt: {
      type: GraphQLString,
    },
    utcOffset: {
      type: GraphQLInt,
    },
    timesToSend: {
      type: GraphQLInt,
    }
  },

  outputFields: {
    notificationsSettings: {
      type: new GraphQLNonNull(UserNotificationsSettingsType)
    }
  },

  mutateAndGetPayload: async ({ startAt, finishAt, utcOffset, timesToSend }, { rootValue: { viewer } }) => {
    let notificationsSettings = await UserNotificationsSettingsStorage.load(viewer.id).catch(e => null)

    if (startAt && !TIME_RE.test(startAt))
      throw new Error(`Expected time value with format "HH:MM" for field "startAt", got "${startAt}"`)

    if (finishAt && !TIME_RE.test(finishAt))
      throw new Error(`Expected time value with format "HH:MM" for field "finishAt", got "${finishAt}"`)

    let attributes = {
      start_at: startAt,
      finish_at: finishAt,
      utc_offset: utcOffset,
      times_to_send: timesToSend,
    }

    attributes = Object.keys(attributes).reduce((memo, key) => {
      if (attributes[key])
        memo[key] = attributes[key]
      return memo
    }, {})

    if (notificationsSettings) {
      notificationsSettings = await UserNotificationsSettingsStorage.update(notificationsSettings.id, attributes)
    } else {
      notificationsSettings = await UserNotificationsSettingsStorage.create({ ...attributes, id: viewer.id  })
    }

    return { notificationsSettings }
  }

})

import UserNotificationsSettingsType from '../types/UserNotificationsSettingsType'
