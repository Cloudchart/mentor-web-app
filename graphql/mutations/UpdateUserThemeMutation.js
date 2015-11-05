import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserStorage,
  UserThemeStorage
} from '../../storage'

import UserType from '../types/UserType'
import UserThemeType from '../types/UserThemeType'
import { userThemesConnection } from '../connections/UserThemesConnection'


const MaxSubscribedThemesCount = 3

export const GraphQLUserThemeStatusEnum = new GraphQLEnumType({
  name: 'UserThemeStatusEnum',

  values: {
    AVAILABLE:  { value: 'available'  },
    VISIBLE:    { value: 'visible'    },
    REJECTED:   { value: 'rejected'   },
    SUBSCRIBED: { value: 'subscribed' },
  }
})


let updateUserThemeMutationGenerator = (name, status) => mutationWithClientMutationId({

  name: name,

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    user: {
      type: new GraphQLNonNull(UserType)
    },
    theme: {
      type: new GraphQLNonNull(UserThemeType)
    },
    themeID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ theme }) => theme.id
    },
  },

  mutateAndGetPayload: async({ id }, { rootValue: { viewer } }) => {
    id = fromGlobalId(id).id

    let theme = await UserThemeStorage.load(id)
    let user  = viewer

    if (theme.user_id !== user.id)
      return new Error('Not authorized')

    if (status === 'subscribed' && theme.status !== 'subscribed') {
      let subscribedUserThemesCount = await UserThemeStorage.count('subscribed', { userID: user.id })
      if (subscribedUserThemesCount >= MaxSubscribedThemesCount)
        return new Error(`Maximum subscribed themes (${MaxSubscribedThemesCount}) count reached`)
    }

    theme = await UserThemeStorage.update(id, { status })

    return { theme, user }
  }

})

export const SubscribeOnThemeMutation     = updateUserThemeMutationGenerator('SubscribeOnTheme', 'subscribed')
export const UnsubscribeFromThemeMutation = updateUserThemeMutationGenerator('UnsubscribeFromTheme', 'visible')
export const RejectThemeMutation          = updateUserThemeMutationGenerator('RejectTheme', 'rejected')
