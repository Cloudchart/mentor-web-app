import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AnswerStorage,
} from '../../storage'

import AnswerType from '../types/AnswerType'


export default mutationWithClientMutationId({

  name: 'UpdateAnswer',

  inputFields: {
    answerID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },

  outputFields: {
    answer: {
      type: new GraphQLNonNull(AnswerType)
    },
  },

  mutateAndGetPayload: async ({ answerID, content, position }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let answer = await AnswerStorage.load(fromGlobalId(answerID).id).catch(() => null)
    if (!answer)
      return new Error('Answer not found.')

    answer = await AnswerStorage.update(answer.id, { content })

    return { answer }
  }

})
