import {
  GraphQLObjectType
} from 'graphql'

import ActivateUserMutation from './ActivateUserMutation'
import ResetUserMutation from './ResetUserMutation'
import SetUserPushTokenMutation from './SetUserPushTokenMutation'
import UpdateUserNotificationsSettingsMutation from './UpdateUserNotificationsSettingsMutation'

import CreateThemeMutation from './admin/CreateThemeMutation'
import UpdateThemeMutation from './admin/UpdateThemeMutation'
import {
  AddCollectionToUserMutation,
  RemoveCollectionFromUserMutation,
} from './UserCollectionMutations'

import {
  SubscribeOnTopicMutation,
  UnsubscribeFromTopicMutation,
} from './UserTopicMutations'


import {
  LikeInsightInTopicMutation,
  DislikeInsightInTopicMutation,
  AddInsightToCollectionMutation,
  MarkInsightUsefulInCollectionMutation,
  MarkInsightUselessInCollectionMutation,
} from './InsightMutations'


import {
  SubscribeOnThemeMutation,
  UnsubscribeFromThemeMutation,
  RejectThemeMutation,
} from './UpdateUserThemeMutation'

import {
  LikeInsightMutation,
  MarkInsightUsefulMutation,
  DislikeInsightMutation,
  MarkInsightUselessMutation,
  ResetInsightMutation,
} from './UpdateUserThemeInsightMutation'


export default new GraphQLObjectType({
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
    updateTheme:                      UpdateThemeMutation,
    addCollectionToUser:              AddCollectionToUserMutation,
    removeCollectionFromUser:         RemoveCollectionFromUserMutation,
    subscribeOnTopic:                 SubscribeOnTopicMutation,
    unsubscribeFromTopic:             UnsubscribeFromTopicMutation,
    likeInsightInTopic:               LikeInsightInTopicMutation,
    dislikeInsightInTopic:            DislikeInsightInTopicMutation,
    addInsightToCollection:           AddInsightToCollectionMutation,
    markInsightUsefulInCollection:    MarkInsightUsefulInCollectionMutation,
    markInsightUselessInCollection:   MarkInsightUselessInCollectionMutation,
  }
})
