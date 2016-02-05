import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql'


import ViewerQuery from './queries/ViewerQuery'
import NodeQuery from './queries/NodeQuery'
import AdminQuery from './queries/AdminQuery'


let queryType = new GraphQLObjectType({

  name: 'Query',

  fields: () => ({
    viewer: ViewerQuery,
    node:   NodeQuery,
    admin:  AdminQuery
  })

})


import ActivateUserMutation from './mutations/ActivateUserMutation'
import ResetUserMutation from './mutations/ResetUserMutation'
import SetUserPushTokenMutation from './mutations/SetUserPushTokenMutation'
import UpdateUserNotificationsSettingsMutation from './mutations/UpdateUserNotificationsSettingsMutation'

import CreateThemeMutation from './mutations/admin/CreateThemeMutation'

import {
  SubscribeOnThemeMutation,
  UnsubscribeFromThemeMutation,
  RejectThemeMutation,
} from './mutations/UpdateUserThemeMutation'

import {
  LikeInsightMutation,
  MarkInsightUsefulMutation,
  DislikeInsightMutation,
  MarkInsightUselessMutation,
  ResetInsightMutation,
} from './mutations/UpdateUserThemeInsightMutation'


let mutationType = new GraphQLObjectType({

  name: 'Mutation',

  fields: {
    activateUser:                     ActivateUserMutation,
    resetUser:                        ResetUserMutation,
    setUserPushToken:                 SetUserPushTokenMutation,
    subscribeOnTheme:                 SubscribeOnThemeMutation,
    unsubscribeFromTheme:             UnsubscribeFromThemeMutation,
    rejectTheme:                      RejectThemeMutation,
    likeInsight:                      LikeInsightMutation,
    markInsightUseful:                MarkInsightUsefulMutation,
    dislikeInsight:                   DislikeInsightMutation,
    markInsightUseless:               MarkInsightUselessMutation,
    resetInsight:                     ResetInsightMutation,
    updateUserNotificationsSettings:  UpdateUserNotificationsSettingsMutation,
    createTheme:                      CreateThemeMutation,
  }

})


let Schema = new GraphQLSchema({

  query:      queryType,
  mutation:   mutationType

})

export default Schema
