import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AnswerStorage,
  QuestionStorage,
} from '../../storage'

import QuestionType from '../types/QuestionType'


export default mutationWithClientMutationId({

  name: 'RemoveAnswer',

  inputFields: {
    answerID: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },

  outputFields: {
    answerID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    question: {
      type: new GraphQLNonNull(QuestionType)
    }
  },

  mutateAndGetPayload: async ({ answerID }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let answer = await AnswerStorage.load(fromGlobalId(answerID).id).catch(() => null)
    if (!answer)
      return new Error('Answer not found.')

    let question = await QuestionStorage.load(answer.question_id).catch(() => null)
    if (!question)
      return new Error('Question not found.')

    await AnswerStorage.destroy(answer.id)

    return { answerID, question }
  }

})
