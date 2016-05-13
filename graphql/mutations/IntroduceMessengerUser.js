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
  MessengerUserStorage,
} from '../../storage'

import UserType from '../types/UserType'


export default mutationWithClientMutationId({

  name: 'IntroduceMessengerUser',

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

    gender: {
      type: GraphQLString,
    },

    timezone: {
      type: GraphQLString,
    },

    locale: {
      type: GraphQLString,
    },

    profilePic: {
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

  mutateAndGetPayload: async({ id, firstName, lastName, gender, timezone, locale, profilePic, authToken }) => {
    let messengerUser = await MessengerUserStorage.load(id).catch(() => null)

    if (messengerUser) return new Error('Messenger user already exists.')

    let user = await UserStorage.create({
      name: [firstName, lastName].filter(part => !!part).join(' ')
    })

    messengerUser = await MessengerUserStorage.create({
      id,
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      profile_pic: profilePic,
      gender,
      timezone,
      locale,
    })

    return { user }
  }

})
