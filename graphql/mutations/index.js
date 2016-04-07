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
  PostponeInsightInTopicMutation,
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

import IntroduceLinkToTopicMutation from './admin/IntroduceLinkToTopic'
import RemoveTopicLinkMutation from './admin/RemoveTopicLink'
import AddInsightToTopicLinkMutation from './AddInsightToTopicLink'
import UpdateTopicLinkMutation from './admin/UpdateTopicLink'

import GrantRoleToUserMutation from './GrantRoleToUser'
import RevokeRoleFromUserMutation from './RevokeRoleFromUser'

import MarkTopicLinkAsReadMutation from './MarkTopicLinkAsRead'


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
    postponeInsightInTopic:           PostponeInsightInTopicMutation,
    addInsightToCollection:           AddInsightToCollectionMutation,
    markInsightUsefulInCollection:    MarkInsightUsefulInCollectionMutation,
    markInsightUselessInCollection:   MarkInsightUselessInCollectionMutation,

    introduceLinkToTopic:             IntroduceLinkToTopicMutation,
    removeTopicLink:                  RemoveTopicLinkMutation,
    addInsightToTopicLink:            AddInsightToTopicLinkMutation,
    updateTopicLink:                  UpdateTopicLinkMutation,

    grantRoleToUser:                  GrantRoleToUserMutation,
    revokeRoleFromUser:               RevokeRoleFromUserMutation,

    markTopicLinkAsRead:              MarkTopicLinkAsReadMutation,
  }
})
