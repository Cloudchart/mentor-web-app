import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AdminStorage,
  QuestionStorage,
  BotReactionStorage,
} from '../../storage'


import AdminType from '../types/admin/AdminType'
import QuestionType from '../types/QuestionType'


export default mutationWithClientMutationId({

  name: 'RemoveQuestionMutation',

  inputFields: {
    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    question: {
      type: new GraphQLNonNull(QuestionType)
    },

    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    admin: {
      type: new GraphQLNonNull(AdminType)
    }
  },

  mutateAndGetPayload: async ({ questionID }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let admin = await AdminStorage.load(viewer.id)

    let question = await QuestionStorage.load(fromGlobalId(questionID).id).catch(() => null)
    if (!question)
      return new Error('Question not found.')

    await QuestionStorage.destroy(question.id)

    return { question, questionID, admin }
  }

})
