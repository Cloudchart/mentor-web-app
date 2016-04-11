import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import QuestionType from '../types/QuestionType'

import {
  EdgeType
} from '../connections/Questions'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  QuestionStorage,
  AnswerStorage,
} from '../../storage'


const InputFields = {
  questionID: {
    type: new GraphQLNonNull(GraphQLID)
  }
}

const OutputFields = {
  question: {
    type: new GraphQLNonNull(QuestionType)
  },
}

const Fields = {
  inputFields: InputFields,
  outputFields: OutputFields,
}

const MutatePublishedStatus = (is_published) =>
  async ({ questionID }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin) return new Error('Not authorized.')

    let question = await QuestionStorage.load(fromGlobalId(questionID).id).catch(error => null)
    if (!question) return new Error('Not found.')

    if (is_published) {
      let answersCount = await AnswerStorage.count('allForQuestion', { question_id: question.id })
      if (answersCount == 0)
        return new Error('Cannot publish question without answers.')
    }

    question = QuestionStorage.update(question.id, { is_published })

    return { question }
  }


export const PublishQuestionMutation = mutationWithClientMutationId({

  name: 'PublishQuestionMutation',

  ...Fields,

  mutateAndGetPayload: MutatePublishedStatus(true)

})


export const UnpublishQuestionMutation = mutationWithClientMutationId({

  name: 'UnpublishQuestionMutation',

  ...Fields,

  mutateAndGetPayload: MutatePublishedStatus(false)
})


export default {
  PublishQuestionMutation,
  UnpublishQuestionMutation,
}
