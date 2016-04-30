import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserStorage,
  TelegramUserStorage,
} from '../../storage'

import UserType from '../types/UserType'


export default mutationWithClientMutationId({

  name: 'IntroduceTelegramUser',

  inputFields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },

    lastName: {
      type: GraphQLString,
    },

    username: {
      type: GraphQLString,
    },

    authToken: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({
    user: {
      type: new GraphQLNonNull(UserType)
    }
  }),

  mutateAndGetPayload: async({ id, firstName, lastName, username, authToken }) => {
    let telegramUser = await TelegramUserStorage.load(id).catch(() => null)

    if (telegramUser) return new Error('Telegram user already exists.')

    let user = await UserStorage.create({
      name: [firstName, lastName].filter(part => !!part).join(' ')
    })

    telegramUser = await TelegramUserStorage.create({
      id,
      username,
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
    })

    return { user }
  }

})
