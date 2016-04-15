import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  AnswerStorage,
  QuestionStorage,
  UserAnswerStorage,
} from '../../../storage'

import {
  nodeToEdge
} from '../../connections/arrayconnection'

import AnswerType from '../../types/AnswerType'
import QuestionType from '../../types/QuestionType'

import {
  EdgeType
} from '../../connections/QuestionAnswers'

export default mutationWithClientMutationId({

  name: 'AnswerTheQuestion',

  inputFields: {
    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    answerID: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },

  outputFields: {
    question: {
      type: new GraphQLNonNull(QuestionType)
    },
    answerEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ answer }) => nodeToEdge(answer)
    },
  },

  mutateAndGetPayload: async ({ questionID, answerID }, { rootValue: { viewer } }) => {
    let question = await QuestionStorage.load(fromGlobalId(questionID).id).catch(() => null)
    if (!question)
      return new Error('Question not found.')

    let answer = await AnswerStorage.load(fromGlobalId(answerID).id).catch(() => null)
    if (!answer)
      return new Error('Answer not found.')

    if (question.id !== answer.question_id)
      return new Error("Answer doesn't belong to question.")

    let existingAnswer = await UserAnswerStorage.loadOne('forUserAndAnswer', { user_id: viewer.id, answer_id: answer.id }).catch(() => null)
    if (existingAnswer)
      return new Error('Question is already answered.')

    await UserAnswerStorage.create({ user_id: viewer.id, answer_id: answer.id })

    return { question, answer }
  }

})
