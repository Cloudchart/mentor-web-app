import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'


import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'


import {
  UserStorage,
  DeviceStorage,
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'SetUserPushToken',

  inputFields: {
    token: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: GraphQLID
    }
  },

  outputFields: {
    user: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ token, userId, }, { rootValue: { viewer } }) => {
    userId = userId ? fromGlobalId(userId).id : viewer.id

    if (userId !== viewer.id)
      return new Error('Not authorized')

    let user    = await UserStorage.load(userId)
    let device  = await DeviceStorage.loadOne('user', { userID: user.id })

    if (!device)
      return new Error("Device doesn't not registered for user")

    await DeviceStorage.update(device.id, { push_token: token })

    return { user }
  }

})

import UserType from '../types/UserType'
