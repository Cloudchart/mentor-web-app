import {
  GraphQLObjectType
} from 'graphql'

import UpdateUserMutation from './UpdateUser'
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

import UpdateTopicMutation from './topic/update'
import RefreshTopicMutation from './topic/refresh'

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


import CreateQuestionMutation from './CreateQuestion'
import UpdateQuestionMutation from './UpdateQuestion'
import RemoveQuestionMutation from './RemoveQuestion'

import {
  PublishQuestionMutation,
  UnpublishQuestionMutation,
} from './UpdateQuestionPublishedStatus'

import AnswerTheQuestionMutation from './question/answer'

import IntroduceAnswerMutation from './IntroduceAnswer'
import UpdateAnswerMutation from './UpdateAnswer'
import RemoveAnswerMutation from './RemoveAnswer'

import {
  SetBotReactionToOwnerMutation,
  AddBotReactionToOwnerMutation,
} from './BotReactionMutations'


import IntroduceTelegramUserMutation from './IntroduceTelegramUser'


export default new GraphQLObjectType({
  name: 'Mutation',

  fields: {
    updateUser:                       UpdateUserMutation,
    activateUser:                     ActivateUserMutation,
    resetUser:                        ResetUserMutation,
    setUserPushToken:                 SetUserPushTokenMutation,
    subscribeOnTheme:                 SubscribeOnThemeMutation,
    unsubscribeFromTheme:             UnsubscribeFromThemeMutation,

    updateTopic:                      UpdateTopicMutation,
    refreshTopic:                     RefreshTopicMutation,

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

    createQuestion:                   CreateQuestionMutation,
    updateQuestion:                   UpdateQuestionMutation,
    removeQuestion:                   RemoveQuestionMutation,
    publishQuestion:                  PublishQuestionMutation,
    unpublishQuestion:                UnpublishQuestionMutation,

    introduceAnswer:                  IntroduceAnswerMutation,
    updateAnswer:                     UpdateAnswerMutation,
    removeAnswer:                     RemoveAnswerMutation,

    answerTheQuestion:                AnswerTheQuestionMutation,

    setBotReactionToOwner:            SetBotReactionToOwnerMutation,
    addBotReactionToOwner:            AddBotReactionToOwnerMutation,

    introduceTelegramUser:            IntroduceTelegramUserMutation,
  }
})
